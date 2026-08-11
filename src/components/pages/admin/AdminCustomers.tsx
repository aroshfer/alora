import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { api } from "../../../utils/api";
import { fmt } from "../../../utils/format";
import type { AdminCustomer } from "../../../types";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = (q: string) => {
    setLoading(true);
    api
      .get<{ customers: AdminCustomer[] }>(`/admin/customers${q ? `?search=${encodeURIComponent(q)}` : ""}`)
      .then((res) => setCustomers(res.customers))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="admin-page-head">
        <h2>Customers</h2>
        <div className="admin-search">
          <Search size={15} />
          <input
            placeholder="Search by name, username, or email…"
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
              <th>Customer</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="muted">Loading…</td></tr>
            )}
            {!loading && customers.length === 0 && (
              <tr><td colSpan={5} className="muted">No customers found.</td></tr>
            )}
            {customers.map((c) => (
              <tr key={c.id}>
                <td>
                  {c.fullName}
                  {c.isAdmin && <span className="status-pill admin-pill">Admin</span>}
                </td>
                <td className="muted">{c.email}</td>
                <td>{c.orderCount}</td>
                <td className="mono">{fmt(c.totalSpent)}</td>
                <td className="muted">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}