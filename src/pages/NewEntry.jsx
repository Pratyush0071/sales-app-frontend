import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { Loader2, Plus, Minus, CheckCircle } from "lucide-react";

export default function NewEntry() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [customFields, setCustomFields] = useState({});
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    api.get("/form-config")
      .then(setConfig)
      .catch(() => setError("Failed to load form"))
      .finally(() => setLoading(false));
  }, []);

  const totalValue = config?.items?.reduce((sum, item) => {
    return sum + (item.price * (quantities[item.id] || 0));
  }, 0) || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const selectedItems = config.items
      .filter((item) => (quantities[item.id] || 0) > 0)
      .map((item) => ({ itemId: item.id, quantity: quantities[item.id] }));

    if (selectedItems.length === 0) {
      setError("Add at least one item with quantity > 0");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/entries", { date, customFields, items: selectedItems });
      setSuccess(true);
      setTimeout(() => navigate("/my-entries"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
  );

  if (success) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h2 className="text-xl font-bold text-gray-900">Entry Submitted!</h2>
      <p className="text-gray-500 text-sm mt-1">Redirecting…</p>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">New Entry</h1>
      <p className="text-sm text-gray-500 mb-6">{user?.name}</p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        {/* Custom fields */}
        {config?.fields?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">Additional Info</h2>
            {config.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.fieldType === "number" ? "number" : "text"}
                  value={customFields[field.label] || ""}
                  onChange={(e) => setCustomFields((p) => ({ ...p, [field.label]: e.target.value }))}
                  required={field.required}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ))}
          </div>
        )}

        {/* Items */}
        {config?.items?.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Items</h2>
            <div className="space-y-4">
              {config.items.map((item) => {
                const qty = quantities[item.id] || 0;
                return (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-800">{item.name}</div>
                      <div className="text-xs text-gray-400">₹{item.price}/{item.unit}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setQuantities((p) => ({ ...p, [item.id]: Math.max(0, qty - 1) }))}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input type="number" min="0" value={qty || ""}
                        onChange={(e) => setQuantities((p) => ({ ...p, [item.id]: Math.max(0, Number(e.target.value)) }))}
                        className="w-16 text-center px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="0"
                      />
                      <button type="button" onClick={() => setQuantities((p) => ({ ...p, [item.id]: qty + 1 }))}
                        className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-orange-700">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {qty > 0 && (
                      <div className="text-sm font-semibold text-primary w-20 text-right">
                        ₹{(item.price * qty).toLocaleString()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {totalValue > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span className="text-primary">₹{totalValue.toLocaleString()}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
            No items configured yet. Ask your admin to add items.
          </div>
        )}

        <button type="submit" disabled={submitting}
          className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-orange-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : "Submit Entry"}
        </button>
      </form>
    </div>
  );
}
