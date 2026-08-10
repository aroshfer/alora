import { INGREDIENTS } from "../data/categories";

export default function IngredientTicker() {
  return (
    <div className="ticker">
      <div className="ticker-track">
        {[...Array(2)].flatMap((_, loop) =>
          INGREDIENTS.map((word, i) => <span key={`${loop}-${i}`}>{word}</span>)
        )}
      </div>
    </div>
  );
}
