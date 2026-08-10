import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";
import { api, ApiError } from "../../utils/api";
import type { User, Order } from "../../types";
import { fmt } from "../../utils/format";
import AddressForm from "../AddressForm";
import PaymentMethodForm from "../PaymentMethodForm";

export default function Checkout() {
  const { user, setUser } = useAuth();
  const { cart, subtotal, clearCart } = useAppContext();
  const navigate = useNavigate();

  const [addressId, setAddressId] = useState(user?.addresses.find((a) => a.isDefault)?.id ?? user?.addresses[0]?.id ?? "");
  const [paymentMethodId, setPaymentMethodId] = useState(
    user?.paymentMethods.find((m) => m.isDefault)?.id ?? user?.paymentMethods[0]?.id ?? ""
  );
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  if (!user) return null;

  const shipping = 450;
  const total = subtotal + shipping;

  const addAddress = async (data: { label: string; line1: string; line2: string; city: string; postalCode: string; country: string }) => {
    const res = await api.post<{ user: User }>("/profile/addresses", data);
    setUser(res.user);
    const newest = res.user.addresses[res.user.addresses.length - 1];
    setAddressId(newest.id);
    setShowAddressForm(false);
  };

  const addCard = async (data: { token: string; brand: string; last4: string; expMonth: number; expYear: number; cardholderName: string }) => {
    const res = await api.post<{ user: User }>("/profile/payment-methods", data);
    setUser(res.user);
    const newest = res.user.paymentMethods[res.user.paymentMethods.length - 1];
    setPaymentMethodId(newest.id);
    setShowCardForm(false);
  };

  const placeOrder = async () => {
    setError(null);
    if (cart.length === 0) return setError("Your cart is empty.");
    if (!addressId) return setError("Select or add a shipping address.");
    if (!paymentMethodId) return setError("Select or add a payment method.");

    setPlacing(true);
    try {
      const { order } = await api.post<{ order: Order }>("/orders", {
        items: cart.map((i) => ({ id: i.id, qty: i.qty })),
        addressId,
        paymentMethodId,
      });
      clearCart();
      navigate(`/order/${order.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't place your order. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="wrap section" style={{ textAlign: "center" }}>
        <h2 style={{ marginBottom: 12 }}>Your cart is empty</h2>
        <p className="muted" style={{ marginBottom: 24 }}>Add something to your bag before checking out.</p>
        <button className="btn btn-primary" onClick={() => navigate("/shop")}>Shop All</button>
      </div>
    );
  }

  return (
    <div className="wrap section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Almost there</span>
          <h2>Checkout</h2>
        </div>
      </div>

      <div className="checkout-grid">
        <div className="checkout-main">
          <div className="account-card">
            <div className="account-card-head">
              <h3>Shipping Address</h3>
              {!showAddressForm && (
                <button className="link-btn" onClick={() => setShowAddressForm(true)}>
                  <Plus size={14} /> Add new
                </button>
              )}
            </div>
            {user.addresses.map((a) => (
              <label className="select-row" key={a.id}>
                <input type="radio" name="address" checked={addressId === a.id} onChange={() => setAddressId(a.id)} />
                <div>
                  <strong>{a.label}</strong>
                  <div className="muted">
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ""}, {a.city} {a.postalCode}, {a.country}
                  </div>
                </div>
              </label>
            ))}
            {user.addresses.length === 0 && !showAddressForm && <p className="muted">No saved addresses — add one to continue.</p>}
            {showAddressForm && <AddressForm onSubmit={addAddress} onCancel={() => setShowAddressForm(false)} />}
          </div>

          <div className="account-card">
            <div className="account-card-head">
              <h3>Payment Method</h3>
              {!showCardForm && (
                <button className="link-btn" onClick={() => setShowCardForm(true)}>
                  <Plus size={14} /> Add new
                </button>
              )}
            </div>
            {user.paymentMethods.map((m) => (
              <label className="select-row" key={m.id}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethodId === m.id}
                  onChange={() => setPaymentMethodId(m.id)}
                />
                <div>
                  <strong>
                    {m.brand} •••• {m.last4}
                  </strong>
                  <div className="muted">
                    Expires {String(m.expMonth).padStart(2, "0")}/{m.expYear} · {m.cardholderName}
                  </div>
                </div>
              </label>
            ))}
            {user.paymentMethods.length === 0 && !showCardForm && <p className="muted">No saved cards — add one to continue.</p>}
            {showCardForm && <PaymentMethodForm onSubmit={addCard} onCancel={() => setShowCardForm(false)} />}
          </div>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>
                {item.name} <span className="muted">× {item.qty}</span>
              </span>
              <span className="mono">{fmt(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-row">
            <span>Subtotal</span>
            <span className="mono">{fmt(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="mono">{fmt(shipping)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span className="mono">{fmt(total)}</span>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={placeOrder} disabled={placing}>
            {placing ? "Placing order…" : "Place Order"}
          </button>
          <p className="field-hint" style={{ marginTop: 10, textAlign: "center" }}>
            Prices are verified server-side at checkout for your security.
          </p>
        </div>
      </div>
    </div>
  );
}
