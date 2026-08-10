import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  MapPin,
  Plus,
  Trash2,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";
import type { User } from "../../types";
import AddressForm from "../AddressForm";
import PaymentMethodForm from "../PaymentMethodForm";

export default function Account() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [addingAddress, setAddingAddress] = useState(false);
  const [addingCard, setAddingCard] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const addAddress = async (data: {
    label: string;
    line1: string;
    line2: string;
    city: string;
    postalCode: string;
    country: string;
  }) => {
    try {
      const res = await api.post<{ user: User }>(
        "/profile/addresses",
        data
      );

      setUser(res.user);
      setAddingAddress(false);
    } catch (error) {
      console.error("Failed to add address:", error);
    }
  };

  const removeAddress = async (id: string) => {
    try {
      const res = await api.del<{ user: User }>(
        `/profile/addresses/${id}`
      );

      setUser(res.user);
    } catch (error) {
      console.error("Failed to remove address:", error);
    }
  };

  const addCard = async (data: {
    token: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    cardholderName: string;
  }) => {
    try {
      const res = await api.post<{ user: User }>(
        "/profile/payment-methods",
        data
      );

      setUser(res.user);
      setAddingCard(false);
    } catch (error) {
      console.error("Failed to add payment method:", error);
    }
  };

  const removeCard = async (id: string) => {
    try {
      const res = await api.del<{ user: User }>(
        `/profile/payment-methods/${id}`
      );

      setUser(res.user);
    } catch (error) {
      console.error("Failed to remove payment method:", error);
    }
  };

  return (
    <div className="account-page">
      <div className="account-container">
        {/* Header */}
        <div className="account-header">
          <div>
            <p className="account-eyebrow">MY ACCOUNT</p>
            <h1>Your Account</h1>
            <p className="account-welcome">
              Welcome back, <strong>{user.fullName}</strong>
            </p>
          </div>

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Account Grid */}
        <div className="account-grid">
          {/* Profile */}
          <div className="account-card">
            <div className="account-card-head">
              <h3>Profile</h3>
            </div>

            <dl className="account-dl">
              <div>
                <dt>Username</dt>
                <dd>{user.username}</dd>
              </div>

              <div>
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>

              <div>
                <dt>Phone</dt>
                <dd>{user.phone || "—"}</dd>
              </div>
            </dl>
          </div>

          {/* Addresses */}
          <div className="account-card">
            <div className="account-card-head">
              <h3>
                <MapPin size={16} />
                <span>Addresses</span>
              </h3>

              {!addingAddress && (
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setAddingAddress(true)}
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              )}
            </div>

            {user.addresses.length === 0 && !addingAddress && (
              <p className="muted">No saved addresses yet.</p>
            )}

            <div className="saved-items">
              {user.addresses.map((address) => (
                <div className="saved-item" key={address.id}>
                  <div className="saved-item-content">
                    <strong>{address.label}</strong>

                    <div className="muted">
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ""}
                      {", "}
                      {address.city} {address.postalCode},{" "}
                      {address.country}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="icon-only"
                    onClick={() => removeAddress(address.id)}
                    aria-label={`Remove ${address.label} address`}
                    title="Remove address"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {addingAddress && (
              <div className="account-form">
                <AddressForm
                  onSubmit={addAddress}
                  onCancel={() => setAddingAddress(false)}
                />
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="account-card">
            <div className="account-card-head">
              <h3>
                <CreditCard size={16} />
                <span>Payment Methods</span>
              </h3>

              {!addingCard && (
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setAddingCard(true)}
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              )}
            </div>

            {user.paymentMethods.length === 0 && !addingCard && (
              <p className="muted">No saved cards yet.</p>
            )}

            <div className="saved-items">
              {user.paymentMethods.map((method) => (
                <div className="saved-item" key={method.id}>
                  <div className="saved-item-content">
                    <strong>
                      {method.brand} •••• {method.last4}
                    </strong>

                    <div className="muted">
                      Expires{" "}
                      {String(method.expMonth).padStart(2, "0")}/
                      {method.expYear}
                      {" · "}
                      {method.cardholderName}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="icon-only"
                    onClick={() => removeCard(method.id)}
                    aria-label={`Remove ${method.brand} ending in ${method.last4}`}
                    title="Remove payment method"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {addingCard && (
              <div className="account-form">
                <PaymentMethodForm
                  onSubmit={addCard}
                  onCancel={() => setAddingCard(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}