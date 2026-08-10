import { Send } from "lucide-react";

interface NewsletterProps {
  onSubscribe: () => void;
}

export default function Newsletter({ onSubscribe }: NewsletterProps) {
  return (
    <section className="newsletter">
      <div className="newsletter-inner">
        <h2>Stay in the glow</h2>
        <p>Subscribe for restock alerts, new drops, and skincare tips — no spam, ever.</p>
        <form
          className="newsletter-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubscribe();
          }}
        >
          <input type="email" placeholder="Enter your email" required />
          <button type="submit" aria-label="Subscribe">
            <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
