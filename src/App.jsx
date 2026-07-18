import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Shell from "./components/Shell";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewEntry from "./pages/NewEntry";
import MyEntries from "./pages/MyEntries";
import Employees from "./pages/admin/Employees";
import FormConfig from "./pages/admin/FormConfig";
import Data from "./pages/admin/Data";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <Shell>{children}</Shell>;
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/entry/new" element={<ProtectedRoute><NewEntry /></ProtectedRoute>} />
      <Route path="/my-entries" element={<ProtectedRoute><MyEntries /></ProtectedRoute>} />
      <Route path="/admin/employees" element={<ProtectedRoute adminOnly><Employees /></ProtectedRoute>} />
      <Route path="/admin/form-config" element={<ProtectedRoute adminOnly><FormConfig /></ProtectedRoute>} />
      <Route path="/admin/data" element={<ProtectedRoute adminOnly><Data /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}
