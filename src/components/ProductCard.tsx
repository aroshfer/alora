import { Heart, Plus } from "lucide-react";
import type { Product } from "../types";
import { CATEGORIES } from "../data/categories";
import { fmt } from "../utils/format";
import Stars from "./Stars";

interface ProductCardProps {
  product: Product;
  onAdd: (p: Product) => void;
  wishlist: number[];
  toggleWish: (id: number) => void;
}

export default function ProductCard({ product, onAdd, wishlist, toggleWish }: ProductCardProps) {
  const Icon = product.icon;
  const isWished = wishlist.includes(product.id);
  const categoryName = CATEGORIES.find((c) => c.id === product.cat)?.name;

  return (
    <div className={`card theme-${product.theme}`}>
      <div className="card-media">
        {product.tag && !product.soldOut && (
          <span className={`badge ${product.tag}`}>
            {product.tag === "new" ? "New" : product.tag === "sale" ? "Sale" : "Bestseller"}
          </span>
        )}
        {product.soldOut && <span className="badge soldout">Sold out</span>}
        <button className="wish-btn" onClick={() => toggleWish(product.id)} aria-label="Toggle wishlist">
          <Heart fill={isWished ? "#C97A44" : "none"} color={isWished ? "#C97A44" : "#292722"} />
        </button>
        <Icon className="prod-icon" />
      </div>
      <div className="card-body">
        <span className="card-cat">{categoryName}</span>
        <div className="card-name">{product.name}</div>
        <Stars rating={product.rating} />
        <div className="price-row">
          <span className="now mono">{fmt(product.price)}</span>
          {product.old && <span className="old mono">{fmt(product.old)}</span>}
        </div>
        <span className="installment">or 3 × {fmt(Math.round(product.price / 3))} with Alora Pay</span>
        <button className="add-btn" disabled={product.soldOut} onClick={() => onAdd(product)}>
          {product.soldOut ? (
            "Sold Out"
          ) : (
            <>
              <Plus size={14} /> Add to Bag
            </>
          )}
        </button>
      </div>
    </div>
  );
}
