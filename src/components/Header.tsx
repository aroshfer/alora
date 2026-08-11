import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Heart, ShoppingBag, User, LayoutDashboard } from "lucide-react";
import NavBar from "./NavBar";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  onMobileOpen: () => void;
}

export default function Header({ onMobileOpen }: HeaderProps) {
  const navigate = useNavigate();
  const { wishlist, cartCount, openCart } = useAppContext();
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="site-header">
      <div className="header-row">
        <button className="hamburger" onClick={onMobileOpen} aria-label="Open menu">
          <Menu size={24} />
        </button>
        <Link to="/" className="logo">
          AL<em>O</em>RA
        </Link>
        <form className="search-box" onSubmit={submitSearch}>
          <Search size={16} />
          <input
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        <div className="header-icons">
          {user?.isAdmin && (
            <Link className="icon-btn" to="/admin" aria-label="Admin dashboard">
              <LayoutDashboard size={20} />
            </Link>
          )}
          <Link className="icon-btn" to={user ? "/account" : "/login"} aria-label={user ? "Account" : "Sign in"}>
            <User size={20} />
          </Link>
          <Link className="icon-btn" to="/wishlist" aria-label="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && <span className="dot">{wishlist.length}</span>}
          </Link>
          <button className="icon-btn" onClick={openCart} aria-label="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="dot">{cartCount}</span>}
          </button>
        </div>
      </div>
      <NavBar />
    </header>
  );
}
