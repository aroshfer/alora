import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "../types";
import { fmt } from "../utils/format";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  changeQty: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  open,
  onClose,
  cart,
  cartCount,
  subtotal,
  changeQty,
  removeItem,
  onCheckout,
}: CartDrawerProps) {
  if (!open) return null;

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-head">
          <h3>Your Bag {cartCount > 0 && `(${cartCount})`}</h3>
          <button onClick={onClose} aria-label="Close cart">
            <X size={22} />
          </button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={40} strokeWidth={1.2} />
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--ink)" }}>Your bag is empty</div>
                <div style={{ fontSize: 13 }}>Add something you'll love.</div>
              </div>
              <button className="btn btn-primary" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const Icon = item.icon;
              return (
                <div className="cart-row" key={item.id}>
                  <div className={`cart-thumb theme-${item.theme}`}>
                    <Icon />
                  </div>
                  <div className="cart-info">
                    <div className="nm">{item.name}</div>
                    <div className="pr mono">{fmt(item.price)}</div>
                    <div className="qty-ctrl">
                      <button onClick={() => changeQty(item.id, -1)} aria-label="Decrease quantity">
                        <Minus size={12} />
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => changeQty(item.id, 1)} aria-label="Increase quantity">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => removeItem(item.id)} aria-label="Remove item">
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-foot">
            <div className="subtotal-row">
              <span>Subtotal</span>
              <span className="mono">{fmt(subtotal)}</span>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>
              Check Out
            </button>
            <div className="cart-note">Shipping &amp; taxes calculated at checkout</div>
          </div>
        )}
      </div>
    </>
  );
}
