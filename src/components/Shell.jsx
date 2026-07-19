import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, Settings, Database,
  PlusCircle, FileText, LogOut, BarChart2,
} from "lucide-react";

export default function Shell({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const adminLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/employees", icon: Users, label: "Team" },
    { to: "/admin/form-config", icon: Settings, label: "Config" },
    { to: "/admin/data", icon: Database, label: "All Data" },
  ];

  const employeeLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { to: "/entry/new", icon: PlusCircle, label: "New Entry" },
    { to: "/my-entries", icon: FileText, label: "My Entries" },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;
  const active = (to) => location.pathname === to;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-navy text-white min-h-screen">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-navy-light">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center font-bold text-sm">SND</div>
          <div>
            <div className="font-bold text-base leading-tight">Sales and Distribution</div>
            <div className="text-xs text-blue-200">Field operations</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active(to) ? "bg-primary text-white" : "text-blue-100 hover:bg-navy-light"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-navy-light">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{user?.name}</div>
              <div className="text-xs text-blue-300 capitalize">{user?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-blue-300 hover:text-white transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-navy text-white z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-xs">SND</div>
          <span className="font-bold">Sales and Distribution</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-300">{user?.name}</span>
          <button onClick={handleLogout} className="p-1.5 rounded hover:bg-navy-light">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 pt-14 md:pt-0 pb-16 md:pb-0 overflow-auto">
        <div className="p-4 md:p-8 max-w-5xl mx-auto">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-40 flex">
        {links.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
              active(to) ? "text-primary" : "text-gray-500"
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
