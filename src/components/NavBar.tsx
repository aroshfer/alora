import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { PRODUCTS } from "../data/products";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        {CATEGORIES.map((c) => {
          const products = PRODUCTS.filter((p) => p.cat === c.id);
          return (
            <div className="nav-item" key={c.id}>
              <Link to={`/category/${c.id}`}>
                {c.name} <ChevronDown size={13} />
              </Link>
              <div className="dropdown">
                {products.length === 0 ? (
                  <span className="dropdown-empty">New arrivals coming soon</span>
                ) : (
                  products.map((p) => (
                    <Link to={`/shop?search=${encodeURIComponent(p.name)}`} key={p.id}>
                      {p.name}
                    </Link>
                  ))
                )}
                <Link to={`/category/${c.id}`} className="dropdown-viewall">
                  View all {c.name}
                </Link>
              </div>
            </div>
          );
        })}
        <div className="nav-item">
          <Link to="/shop" style={{ padding: "13px 16px", display: "block", fontSize: 13.5, fontWeight: 600 }}>
            All Products
          </Link>
        </div>
        <div className="nav-item">
          <Link to="/journal" style={{ padding: "13px 16px", display: "block", fontSize: 13.5, fontWeight: 600 }}>
            Journal
          </Link>
        </div>
      </div>
    </nav>
  );
}
