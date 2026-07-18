import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(employeeId, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl mb-3">ST</div>
        <h1 className="text-2xl font-bold text-gray-900">SalesTrack</h1>
        <p className="text-sm text-gray-500 mt-1">Field operations &amp; reporting</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">{error}</div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Employee ID</label>
          <input
            type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="e.g. ST-1042" required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-orange-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign In"}
        </button>
      </form>
    </div>
  );
}
