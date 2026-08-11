import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Receipt, Users } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="admin-shell wrap">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">Admin</div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? "active" : "")}>
            <LayoutDashboard size={16} /> Overview
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? "active" : "")}>
            <Receipt size={16} /> Orders
          </NavLink>
          <NavLink to="/admin/customers" className={({ isActive }) => (isActive ? "active" : "")}>
            <Users size={16} /> Customers
          </NavLink>
        </nav>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}