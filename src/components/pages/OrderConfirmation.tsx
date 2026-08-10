import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { api } from "../../utils/api";
import type { Order } from "../../types";
import { fmt } from "../../utils/format";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    api
      .get<{ order: Order }>(`/orders/${orderId}`)
      .then((res) => setOrder(res.order))
      .catch(() => setError(true));
  }, [orderId]);

  if (error) {
    return (
      <div className="wrap section" style={{ textAlign: "center" }}>
        <h2>Order not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
          Back to Home
        </Link>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="wrap section" style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <CheckCircle2 size={48} color="var(--sage-dark)" strokeWidth={1.4} />
        <h2 style={{ marginTop: 14 }}>Order confirmed</h2>
        <p className="muted">Order #{order.id.slice(0, 8)} · {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <div className="order-summary">
        {order.items.map((item) => (
          <div className="summary-row" key={item.productId}>
            <span>
              {item.name} <span className="muted">× {item.qty}</span>
            </span>
            <span className="mono">{fmt(item.price * item.qty)}</span>
          </div>
        ))}
        <div className="summary-divider" />
        <div className="summary-row">
          <span>Subtotal</span>
          <span className="mono">{fmt(order.subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span className="mono">{fmt(order.shipping)}</span>
        </div>
        <div className="summary-row summary-total">
          <span>Total</span>
          <span className="mono">{fmt(order.total)}</span>
        </div>
      </div>

      <div className="account-card" style={{ marginTop: 24 }}>
        <h3>Shipping to</h3>
        <p className="muted">
          {order.shippingAddress.line1}
          {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}, {order.shippingAddress.city}{" "}
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </p>
        <h3 style={{ marginTop: 18 }}>Paid with</h3>
        <p className="muted">
          {order.paymentSummary.brand} •••• {order.paymentSummary.last4}
        </p>
      </div>

      <Link to="/shop" className="btn btn-primary" style={{ marginTop: 28, justifyContent: "center" }}>
        Continue Shopping
      </Link>
    </div>
  );
}
