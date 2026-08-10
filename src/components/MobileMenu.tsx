import { Link } from "react-router-dom";
import { X, ChevronDown } from "lucide-react";
import { CATEGORIES } from "../data/categories";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  openCat: string | null;
  setOpenCat: (id: string | null) => void;
}

export default function MobileMenu({ open, onClose, openCat, setOpenCat }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="mobile-menu">
      <div className="backdrop" onClick={onClose} />
      <div className="mobile-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Link to="/" className="logo" style={{ fontSize: 24 }} onClick={onClose}>
            AL<em>O</em>RA
          </Link>
          <button onClick={onClose} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        {CATEGORIES.map((c) => (
          <div className="mobile-cat" key={c.id}>
            <div onClick={() => setOpenCat(openCat === c.id ? null : c.id)}>
              {c.name}
              <ChevronDown
                size={16}
                style={{ transform: openCat === c.id ? "rotate(180deg)" : "none", transition: "transform .15s" }}
              />
            </div>
            {openCat === c.id && (
              <div className="sub-list">
                {c.sub.map((s) => (
                  <Link to={`/category/${c.id}`} key={s} onClick={onClose}>
                    {s}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="mobile-cat">
          <Link to="/journal" onClick={onClose} style={{ fontWeight: 600, fontSize: 15 }}>
            Journal
          </Link>
        </div>
      </div>
    </div>
  );
}
