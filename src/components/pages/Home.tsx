import { useEffect, useState } from "react";
import Hero from "../Hero";
import IngredientTicker from "../IngredientTicker";
import ProductSection from "../ProductSection";
import CategoryGrid from "../CategoryGrid";
import ConcernList from "../ConcernList";
import BrandStory from "../BrandStory";
import Reviews from "../Reviews";
import Journal from "../Journal";
import Newsletter from "../Newsletter";
import { PRODUCTS } from "../../data/products";
import { HERO_SLIDES } from "../../data/content";
import { useAppContext } from "../../context/AppContext";

export default function Home() {
  const [slide, setSlide] = useState(0);
  const { addToCart, wishlist, toggleWish, showToast } = useAppContext();

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const newArrivals = PRODUCTS.filter((p) => p.tag === "new");
  const featured = PRODUCTS.slice(0, 8);
  const bestSellers = PRODUCTS.filter((p) => p.tag === "bestseller" || p.tag === "sale").slice(0, 8);

  return (
    <>
      <Hero slide={slide} setSlide={setSlide} />
      <IngredientTicker />

      <ProductSection
        eyebrow="Just Landed"
        title="New Arrivals"
        products={newArrivals}
        layout="row"
        onAdd={addToCart}
        wishlist={wishlist}
        toggleWish={toggleWish}
      />

      <CategoryGrid />
      <ConcernList />

      <ProductSection
        eyebrow="Curated For You"
        title="Featured Products"
        products={featured}
        layout="grid"
        onAdd={addToCart}
        wishlist={wishlist}
        toggleWish={toggleWish}
      />

      <BrandStory />

      <ProductSection
        eyebrow="Fan Favourites"
        title="Best Selling Items"
        products={bestSellers}
        layout="grid"
        onAdd={addToCart}
        wishlist={wishlist}
        toggleWish={toggleWish}
      />

      <Reviews />
      <Journal />
      <Newsletter onSubscribe={() => showToast("Thanks for subscribing!")} />
    </>
  );
}
