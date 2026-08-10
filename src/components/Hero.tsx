import { Link } from "react-router-dom";
import { Sparkles, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "../data/content";

interface HeroProps {
  slide: number;
  setSlide: (i: number) => void;
}

export default function Hero({ slide, setSlide }: HeroProps) {
  const data = HERO_SLIDES[slide];

  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <div>
          <span className="hero-eyebrow">{data.eyebrow}</span>
          <h1>{data.title}</h1>
          <p>{data.sub}</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link to="/shop" className="btn btn-primary">
              {data.cta} <ChevronRight size={15} />
            </Link>
            <Link to="/" className="btn btn-ghost">
              Our Story
            </Link>
          </div>
          <div className="hero-dots">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                className={i === slide ? "active" : ""}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-ring" style={{ inset: "-2%" }} />
          <div className="hero-blob" />
          <Sparkles className="center-icon" strokeWidth={1.2} />
        </div>
      </div>
    </section>
  );
}
