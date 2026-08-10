import { Link } from "react-router-dom";
import { JOURNAL } from "../data/content";

export default function Journal() {
  return (
    <section className="section wrap" id="journal">
      <div className="section-head">
        <div>
          <span className="eyebrow">Read</span>
          <h2>More on the Journal</h2>
        </div>
      </div>
      <div className="journal-grid">
        {JOURNAL.map((j) => (
          <div className="journal-card" key={j.title}>
            <div className="journal-media" />
            <div className="journal-body">
              <div className="journal-date">Alora · {j.date}</div>
              <h3 className="journal-title">{j.title}</h3>
              <Link to="/journal" className="journal-link">
                Read more
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
