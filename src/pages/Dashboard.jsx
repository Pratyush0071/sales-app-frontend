import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import { TrendingUp, Users, Calendar, DollarSign, PlusCircle, FileText, Loader2 } from "lucide-react";

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/entries/summary")
      .then(setSummary)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
  );

  const fmt = (n) => new Intl.NumberFormat().format(n || 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Entries" value={fmt(summary?.totalEntries)} icon={FileText} color="bg-blue-500" />
        <StatCard label="Total Value" value={`₹${fmt(summary?.totalValue)}`} icon={DollarSign} color="bg-green-500" />
        <StatCard label="Today's Entries" value={fmt(summary?.todayEntries)} icon={Calendar} color="bg-orange-500" />
        <StatCard label="Today's Value" value={`₹${fmt(summary?.todayValue)}`} icon={TrendingUp} color="bg-purple-500" />
        <StatCard label="Employees" value={fmt(summary?.employeeCount)} icon={Users} color="bg-navy" />
      </div>

      {summary?.topItems?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Top Items</h2>
          <div className="space-y-3">
            {summary.topItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-800">{item.itemName}</div>
                  <div className="text-xs text-gray-400">Qty: {item.totalQty}</div>
                </div>
                <div className="text-sm font-semibold text-primary">₹{fmt(item.totalValue)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EmployeeDashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
      <p className="text-gray-500 text-sm mb-8">What would you like to do today?</p>
      <div className="grid gap-4">
        <Link to="/entry/new"
          className="bg-primary text-white rounded-2xl p-6 flex items-center gap-4 hover:bg-orange-700 transition-colors">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold text-lg">New Entry</div>
            <div className="text-sm text-orange-100">Submit today's outlet data</div>
          </div>
        </Link>
        <Link to="/my-entries"
          className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center gap-4 hover:border-primary transition-colors">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-navy" />
          </div>
          <div>
            <div className="font-semibold text-lg text-gray-900">My Entries</div>
            <div className="text-sm text-gray-400">View and export your submissions</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  return user?.role === "admin" ? <AdminDashboard /> : <EmployeeDashboard />;
}
