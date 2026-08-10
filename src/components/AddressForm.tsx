import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

interface AddressFormProps {
  onSubmit: (data: {
    label: string;
    line1: string;
    line2: string;
    city: string;
    postalCode: string;
    country: string;
  }) => Promise<void>;
  onCancel?: () => void;
}

export default function AddressForm({ onSubmit, onCancel }: AddressFormProps) {
  const [form, setForm] = useState({ label: "Home", line1: "", line2: "", city: "", postalCode: "", country: "Sri Lanka" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save that address.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <div className="field-row">
        <div className="field">
          <label>Label</label>
          <input value={form.label} onChange={update("label")} placeholder="Home, Work…" />
        </div>
        <div className="field">
          <label>Country</label>
          <input value={form.country} onChange={update("country")} required />
        </div>
      </div>
      <div className="field">
        <label>Address line</label>
        <input value={form.line1} onChange={update("line1")} required />
      </div>
      <div className="field">
        <label>Apartment / suite (optional)</label>
        <input value={form.line2} onChange={update("line2")} />
      </div>
      <div className="field-row">
        <div className="field">
          <label>City</label>
          <input value={form.city} onChange={update("city")} required />
        </div>
        <div className="field">
          <label>Postal code</label>
          <input value={form.postalCode} onChange={update("postalCode")} />
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save Address"}
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
