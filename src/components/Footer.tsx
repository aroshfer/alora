import { Instagram, Facebook, Youtube, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              AL<em style={{ fontStyle: "normal", color: "var(--peach)" }}>O</em>RA
            </div>
            <p className="about">
              At Alora, we're committed to bringing 100% original products from trusted
              international markets to your door — with a safe, reliable and convenient
              online shopping experience.
            </p>
            <div className="social-row">
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="Instagram">
                <Instagram />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="Facebook">
                <Facebook />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="YouTube">
                <Youtube />
              </a>
            </div>
          </div>
          <div>
            <h4>Useful Links</h4>
            <ul>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()}>Contact</a>
              </li>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()}>Policies &amp; FAQs</a>
              </li>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()}>Track Order</a>
              </li>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()}>Brands</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Locations</h4>
            <div className="loc-block">
              <strong>Sri Lanka</strong>
              <span style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <MapPin size={13} style={{ marginTop: 2, flexShrink: 0 }} /> Galle City Center, Galle, Sri Lanka
              </span>
              <span style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                <Phone size={13} /> +94 77 578 9828
              </span>
            </div>
            <div className="loc-block">
              <strong>USA Office</strong>
              <span style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <MapPin size={13} style={{ marginTop: 2, flexShrink: 0 }} /> Torrance, California, USA
              </span>
            </div>
          </div>
          <div>
            <h4>Newsletter</h4>
            <p style={{ fontSize: 13.5, color: "#a8a296", marginBottom: 14 }}>
              Skincare tips and new arrivals, straight to your inbox.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Alora. All rights reserved.</span>
          <span>Made with care in Sri Lanka</span>
        </div>
      </div>
    </footer>
  );
}
