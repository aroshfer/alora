import { useState } from "react";
import type { FormEvent } from "react";
import { tokenizeCard } from "../utils/cardTokenizer";

interface PaymentMethodFormProps {
  onSubmit: (data: {
    token: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    cardholderName: string;
  }) => Promise<void>;
  onCancel?: () => void;
}

export default function PaymentMethodForm({ onSubmit, onCancel }: PaymentMethodFormProps) {
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const month = Number(expMonth);
    const year = Number(expYear);
    if (!month || month < 1 || month > 12) return setError("Enter a valid expiry month (1-12).");
    if (!year || year < new Date().getFullYear()) return setError("Enter a valid expiry year.");
    if (!/^\d{3,4}$/.test(cvv)) return setError("Enter a valid CVV.");

    setSubmitting(true);
    try {
      // Tokenization happens here, in the browser. Only the resulting
      // token + display metadata leaves this function — the raw card
      // number and CVV are never sent to our server.
      const { token, brand, last4 } = await tokenizeCard(cardNumber, cvv);
      await onSubmit({ token, brand, last4, expMonth: month, expYear: year, cardholderName });
      setCardNumber("");
      setCvv("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save that card.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Cardholder name</label>
        <input value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} required />
      </div>
      <div className="field">
        <label>Card number</label>
        <input
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="4242 4242 4242 4242"
          required
        />
      </div>
      <div className="field-row three">
        <div className="field">
          <label>Exp. month</label>
          <input value={expMonth} onChange={(e) => setExpMonth(e.target.value)} inputMode="numeric" placeholder="MM" required />
        </div>
        <div className="field">
          <label>Exp. year</label>
          <input value={expYear} onChange={(e) => setExpYear(e.target.value)} inputMode="numeric" placeholder="YYYY" required />
        </div>
        <div className="field">
          <label>CVV</label>
          <input value={cvv} onChange={(e) => setCvv(e.target.value)} inputMode="numeric" autoComplete="cc-csc" required />
        </div>
      </div>

      <span className="field-hint">
        Your card number and CVV are used only to generate a payment token in your browser — neither is ever sent to or
        stored on our servers.
      </span>

      {error && <div className="form-error">{error}</div>}

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save Card"}
        </button>
        {onCancel && (
          <button className="btn btn-ghost" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
