import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { api } from "../../../utils/api";
import { fmt } from "../../../utils/format";
import type { AdminStats } from "../../../types";

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get<AdminStats>("/admin/stats")
      .then(setStats)
      .catch(() => setError(true));
  }, []);

  if (error) return <p className="muted">Couldn't load dashboard data.</p>;
  if (!stats) return <div className="route-loader"><div className="route-loader-spinner" /><span>Loading…</span></div>;

  const chartData = stats.revenueByDay.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  }));

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Overview</h2>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total Revenue</span>
          <span className="kpi-value mono">{fmt(stats.totalRevenue)}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Total Orders</span>
          <span className="kpi-value mono">{stats.totalOrders}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Avg. Order Value</span>
          <span className="kpi-value mono">{fmt(stats.avgOrderValue)}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Total Customers</span>
          <span className="kpi-value mono">{stats.totalCustomers}</span>
        </div>
      </div>

      <div className="account-card" style={{ marginTop: 24 }}>
        <h3>Revenue — Last 14 Days</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8a8375" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8a8375" }} axisLine={false} tickLine={false} width={70} tickFormatter={(v: number) => fmt(v)} />
              <Tooltip
                formatter={(value: number) => fmt(value)}
                contentStyle={{ borderRadius: 10, border: "1px solid var(--line)", fontSize: 12.5 }}
              />
              <Line type="monotone" dataKey="revenue" stroke="var(--sage-dark)" strokeWidth={2.4} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-two-col">
        <div className="account-card">
          <h3>Top Products</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.length === 0 && (
                <tr><td colSpan={3} className="muted">No sales yet.</td></tr>
              )}
              {stats.topProducts.map((p) => (
                <tr key={p.name}>
                  <td>{p.name}</td>
                  <td>{p.qty}</td>
                  <td className="mono">{fmt(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="account-card">
          <h3>Recent Orders</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 && (
                <tr><td colSpan={4} className="muted">No orders yet.</td></tr>
              )}
              {stats.recentOrders.map((o) => (
                <tr key={o.id}>
                  <td className="mono">#{o.id.slice(0, 8)}</td>
                  <td>{o.customerName}</td>
                  <td>{o.itemCount}</td>
                  <td className="mono">{fmt(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}