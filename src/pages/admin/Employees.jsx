import { useEffect, useState } from "react";
import { api } from "../../api";
import { Plus, Pencil, Trash2, Loader2, Users, X, Check } from "lucide-react";

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 px-4 pb-4 md:pb-0">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

const EMPTY_FORM = { name: "", employeeId: "", password: "", role: "employee" };

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "create" | employee object
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.get("/employees").then(setEmployees).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setError(""); setModal("create"); };
  const openEdit = (emp) => { setForm({ name: emp.name, employeeId: emp.employeeId, password: "", role: emp.role }); setError(""); setModal(emp); };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      const body = { name: form.name, employeeId: form.employeeId, role: form.role };
      if (form.password) body.password = form.password;
      if (modal === "create") {
        if (!form.password) { setError("Password is required"); setSaving(false); return; }
        body.password = form.password;
        await api.post("/employees", body);
      } else {
        await api.put(`/employees/${modal.id}`, body);
      }
      load(); setModal(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this employee?")) return;
    await api.delete(`/employees/${id}`).catch(() => {});
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Team</h1>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-orange-700">
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
      ) : employees.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400">
          <Users className="w-12 h-12 mb-3" />
          <p className="text-sm">No employees yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {emp.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">{emp.name}</div>
                <div className="text-xs text-gray-400">{emp.employeeId} · <span className="capitalize">{emp.role}</span></div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(emp)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-700">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(emp.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== null && (
        <Modal title={modal === "create" ? "Add Employee" : "Edit Employee"} onClose={() => setModal(null)}>
          {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
          <form onSubmit={handleSave} className="space-y-4">
            {[
              { label: "Full Name", key: "name", type: "text", required: true },
              { label: "Employee ID", key: "employeeId", type: "text", required: true },
              { label: modal === "create" ? "Password" : "New Password (leave blank to keep)", key: "password", type: "password", required: modal === "create" },
            ].map(({ label, key, type, required }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input type={type} value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  required={required}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
              <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-orange-700 disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {modal === "create" ? "Create" : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
