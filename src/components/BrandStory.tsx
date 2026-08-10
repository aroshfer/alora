export default function BrandStory() {
  return (
    <section className="story" id="story">
      <div className="story-inner">
        <div>
          <span className="eyebrow">Our Promise</span>
          <h2>
            Sri Lanka's home for
            <br />
            clean, authentic beauty.
          </h2>
          <p style={{ fontSize: 14.5, opacity: 0.85, maxWidth: 340 }}>
            We work directly with brands across the USA, Korea and Canada so every bottle
            that reaches you is genuine, ethically sourced, and honestly priced.
          </p>
        </div>
        <div className="story-stat">
          <span className="num mono">120+</span>
          <span className="lbl">Authentic Brands Stocked</span>
        </div>
        <div className="story-stat">
          <span className="num mono">25k+</span>
          <span className="lbl">Orders Delivered Islandwide</span>
        </div>
      </div>
    </section>
  );
}
