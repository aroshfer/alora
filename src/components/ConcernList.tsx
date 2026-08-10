import { Link } from "react-router-dom";
import { CONCERNS } from "../data/categories";

export default function ConcernList() {
  return (
    <section className="section wrap" style={{ paddingTop: 0 }}>
      <div className="section-head">
        <div>
          <span className="eyebrow">Personalised</span>
          <h2>Shop by Skin Concern</h2>
        </div>
      </div>
      <div className="concern-row">
        {CONCERNS.map((c) => (
          <Link to="/shop" className="concern-pill" key={c}>
            {c}
          </Link>
        ))}
      </div>
    </section>
  );
}
