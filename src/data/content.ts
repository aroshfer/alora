import type { ReviewItem, JournalPost, HeroSlide } from "../types";

export const REVIEWS: ReviewItem[] = [
  { name: "Prathibha F.", text: "An absolute delight from start to finish — every item exceeded my expectations, and the team is attentive and genuinely committed to getting it right.", initial: "P" },
  { name: "Dulani L.", text: "My order arrived just two days after I placed it, beautifully packaged. Exactly the kind of quality and speed I look for.", initial: "D" },
  { name: "Hasini R.", text: "Reliable, friendly, and easy to shop with end to end. This is now my go-to for skincare restocks.", initial: "H" },
];

export const JOURNAL: JournalPost[] = [
  { title: "Why Your Skin Actually Needs Collagen After 25", date: "Aug 03, 2026" },
  { title: "Clean, Superfood-Based Cleansers Are Having a Moment", date: "Aug 02, 2026" },
  { title: "Five Ways to Spot Counterfeit Skincare Before You Buy", date: "Aug 01, 2026" },
];

export const HERO_SLIDES: HeroSlide[] = [
  { eyebrow: "Islandwide · Authentic · Curated", title: "Skincare worth\nbelieving in.", sub: "Genuine formulas from Seoul, California and beyond — delivered across Sri Lanka.", cta: "Shop New Arrivals" },
  { eyebrow: "Now Restocked", title: "The glow is\nback in stock.", sub: "Cult-favourite serums and sunscreens, back on the shelf for a limited run.", cta: "Explore Bestsellers" },
  { eyebrow: "Flexible Checkout", title: "Pay it in three,\nnot all at once.", sub: "Split any order into easy instalments at checkout — no extra paperwork.", cta: "Learn More" },
];
