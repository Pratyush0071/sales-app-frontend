import { useEffect, useState } from "react";
import { api } from "../../api";
import { Plus, Trash2, Loader2, Settings, Package } from "lucide-react";

function Section({ title, icon: Icon, children, onAdd, addLabel }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        </div>
        <button onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-orange-700">
          <Plus className="w-3.5 h-3.5" /> {addLabel}
        </button>
      </div>
      <div className="divide-y divide-gray-50">{children}</div>
    </div>
  );
}

export default function FormConfig() {
  const [config, setConfig] = useState({ fields: [], items: [] });
  const [loading, setLoading] = useState(true);

  // Field form
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [fieldForm, setFieldForm] = useState({ label: "", fieldType: "text", required: false, sortOrder: 0 });
  const [savingField, setSavingField] = useState(false);

  // Item form
  const [showItemForm, setShowItemForm] = useState(false);
  const [itemForm, setItemForm] = useState({ name: "", unit: "", price: "" });
  const [savingItem, setSavingItem] = useState(false);

  const load = () => {
    api.get("/form-config").then(setConfig).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const addField = async (e) => {
    e.preventDefault(); setSavingField(true);
    try {
      await api.post("/form-config/fields", { ...fieldForm, sortOrder: Number(fieldForm.sortOrder) });
      setFieldForm({ label: "", fieldType: "text", required: false, sortOrder: 0 });
      setShowFieldForm(false); load();
    } catch (err) { alert(err.message); }
    finally { setSavingField(false); }
  };

  const deleteField = async (id) => {
    if (!confirm("Delete this field?")) return;
    await api.delete(`/form-config/fields/${id}`).catch(() => {});
    load();
  };

  const addItem = async (e) => {
    e.preventDefault(); setSavingItem(true);
    try {
      await api.post("/form-config/items", { ...itemForm, price: Number(itemForm.price) });
      setItemForm({ name: "", unit: "", price: "" });
      setShowItemForm(false); load();
    } catch (err) { alert(err.message); }
    finally { setSavingItem(false); }
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;
    await api.delete(`/form-config/items/${id}`).catch(() => {});
    load();
  };

  if (loading) return (
    <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Form Config</h1>
      <div className="space-y-6">

        {/* Form Fields */}
        <Section title="Custom Form Fields" icon={Settings}
          onAdd={() => setShowFieldForm((p) => !p)} addLabel="Add Field">
          {showFieldForm && (
            <form onSubmit={addField} className="p-4 bg-gray-50 space-y-3">
              <input value={fieldForm.label} onChange={(e) => setFieldForm((p) => ({ ...p, label: e.target.value }))}
                placeholder="Field label" required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <div className="flex gap-2">
                <select value={fieldForm.fieldType} onChange={(e) => setFieldForm((p) => ({ ...p, fieldType: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                </select>
                <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={fieldForm.required}
                    onChange={(e) => setFieldForm((p) => ({ ...p, required: e.target.checked }))}
                    className="rounded" />
                  Required
                </label>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowFieldForm(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={savingField}
                  className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-orange-700 disabled:opacity-60">
                  {savingField ? "Saving…" : "Add"}
                </button>
              </div>
            </form>
          )}
          {config.fields.length === 0 && !showFieldForm && (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">No custom fields yet</div>
          )}
          {config.fields.map((field) => (
            <div key={field.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <span className="text-sm font-medium text-gray-800">{field.label}</span>
                <span className="ml-2 text-xs text-gray-400 capitalize">{field.fieldType}</span>
                {field.required && <span className="ml-2 text-xs text-red-500">required</span>}
              </div>
              <button onClick={() => deleteField(field.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </Section>

        {/* Items */}
        <Section title="Items / Products" icon={Package}
          onAdd={() => setShowItemForm((p) => !p)} addLabel="Add Item">
          {showItemForm && (
            <form onSubmit={addItem} className="p-4 bg-gray-50 space-y-3">
              <input value={itemForm.name} onChange={(e) => setItemForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Item name" required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <div className="flex gap-2">
                <input value={itemForm.unit} onChange={(e) => setItemForm((p) => ({ ...p, unit: e.target.value }))}
                  placeholder="Unit (e.g. kg, pcs)" required
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <input type="number" value={itemForm.price} onChange={(e) => setItemForm((p) => ({ ...p, price: e.target.value }))}
                  placeholder="Price (₹)" required min="0" step="0.01"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowItemForm(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={savingItem}
                  className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-orange-700 disabled:opacity-60">
                  {savingItem ? "Saving…" : "Add"}
                </button>
              </div>
            </form>
          )}
          {config.items.length === 0 && !showItemForm && (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">No items configured yet</div>
          )}
          {config.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <span className="text-sm font-medium text-gray-800">{item.name}</span>
                <span className="mx-2 text-xs text-gray-400">{item.unit}</span>
                <span className="text-sm font-semibold text-primary">₹{item.price}</span>
              </div>
              <button onClick={() => deleteItem(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </Section>

      </div>
    </div>
  );
}
