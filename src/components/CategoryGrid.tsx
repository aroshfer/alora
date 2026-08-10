import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/categories";

export default function CategoryGrid() {
  return (
    <section className="section wrap" style={{ paddingTop: 0 }}>
      <div className="section-head">
        <div>
          <span className="eyebrow">Browse</span>
          <h2>Shop by Category</h2>
        </div>
      </div>
      <div className="cat-grid">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          return (
            <Link to={`/category/${c.id}`} className="cat-tile" key={c.id}>
              <div className="cat-circle">
                <Icon strokeWidth={1.5} />
              </div>
              <span>{c.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
