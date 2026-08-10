import { REVIEWS } from "../data/content";
import Stars from "./Stars";

export default function Reviews() {
  return (
    <section className="section wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow">Word on the Street</span>
          <h2>Customer Reviews</h2>
        </div>
      </div>
      <div className="review-grid">
        {REVIEWS.map((r) => (
          <div className="review-card" key={r.name}>
            <Stars rating={5} />
            <p>{r.text}</p>
            <div className="reviewer">
              <div className="av">{r.initial}</div>
              <div>
                <div className="name">{r.name}</div>
                <div className="verified">Verified Buyer</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
