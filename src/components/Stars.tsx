import { Star } from "lucide-react";

export default function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars">
      <Star /> {rating.toFixed(1)}
    </span>
  );
}
