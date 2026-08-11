import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { api } from "../../../utils/api";
import { fmt } from "../../../utils/format";
import type { AdminOrder } from "../../../types";

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = (q: string) => {
    setLoading(true);
    api
      .get<{ orders: AdminOrder[] }>(`/admin/orders${q ? `?search=${encodeURIComponent(q)}` : ""}`)
      .then((res) => setOrders(res.orders))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="admin-page-head">
        <h2>Orders</h2>
        <div className="admin-search">
          <Search size={15} />
          <input
            placeholder="Search by order ID, customer name, or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(search)}
          />
        </div>
      </div>

      <div className="account-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="muted">Loading…</td></tr>
            )}
            {!loading && orders.length === 0 && (
              <tr><td colSpan={6} className="muted">No orders found.</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="mono">#{o.id.slice(0, 8)}</td>
                <td>
                  {o.customerName}
                  <div className="muted">{o.customerEmail}</div>
                </td>
                <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                <td className="mono">{fmt(o.total)}</td>
                <td><span className="status-pill">{o.status}</span></td>
                <td className="muted">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}