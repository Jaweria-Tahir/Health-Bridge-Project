import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  MapPinned,
  BookOpen,
  MessagesSquare,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import Orb from "../ui/Orb.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { isStaff, roleLabel } from "../../utils/roles.js";

const baseLinks = [
  { to: "/app", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/app/assistant", label: "AI Assistant", icon: Sparkles },
  { to: "/app/resources", label: "Resources", icon: MapPinned },
  { to: "/app/education", label: "Education", icon: BookOpen },
  { to: "/app/questions", label: "Questions", icon: MessagesSquare },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const staff = isStaff(user?.role);

  return (
    <aside className="fixed hidden h-screen w-[248px] flex-col border-r border-glass-hair bg-void-800/60 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3 px-6 py-6">
        <Orb size="sm" />
        <div>
          <p className="font-display text-base leading-tight text-ink">HealthBridge</p>
          <p className="text-[11px] text-ink-faint">Community Health AI</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {baseLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-gradient-to-r from-bridge-sky/15 to-bridge-violet/15 text-ink shadow-[inset_0_0_0_1px_rgba(148,163,255,0.25)]"
                  : "text-ink-muted hover:bg-white/[0.04] hover:text-ink"
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {label}
          </NavLink>
        ))}

        {staff && (
          <>
            <p className="px-3.5 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
              Manage
            </p>
            <NavLink
              to="/app/manage"
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-bridge-sky/15 to-bridge-violet/15 text-ink shadow-[inset_0_0_0_1px_rgba(148,163,255,0.25)]"
                    : "text-ink-muted hover:bg-white/[0.04] hover:text-ink"
                }`
              }
            >
              <ShieldCheck size={18} className="shrink-0" />
              Control Center
            </NavLink>
          </>
        )}
      </nav>

      <div className="border-t border-glass-hair px-4 py-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-bridge-sky to-bridge-violet text-xs font-semibold text-void">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{user?.name}</p>
            <p className="truncate text-[11px] text-ink-faint">{roleLabel(user?.role)}</p>
          </div>
        </div>
        <button onClick={logout} className="btn-ghost w-full justify-start gap-2.5 !px-3.5">
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
