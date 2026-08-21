import { NavLink } from "react-router-dom";
import { Home, MapPinned, BookOpen, User, Sparkles } from "lucide-react";

const items = [
  { to: "/app", label: "Home", icon: Home, end: true },
  { to: "/app/resources", label: "Resources", icon: MapPinned },
  { to: "/app/assistant", label: "AI", icon: Sparkles, center: true },
  { to: "/app/education", label: "Learn", icon: BookOpen },
  { to: "/app/profile", label: "Profile", icon: User },
];

export default function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-glass-hair bg-void-800/85 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {items.map(({ to, label, icon: Icon, end, center }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              center
                ? "relative -mt-6 flex flex-col items-center gap-1"
                : `flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors ${
                    isActive ? "text-bridge-sky" : "text-ink-faint hover:text-ink-muted"
                  }`
            }
          >
            {({ isActive }) =>
              center ? (
                <>
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-bridge-sky via-bridge-blue to-bridge-violet shadow-orb ${
                      isActive ? "ring-2 ring-bridge-sky/60" : ""
                    }`}
                  >
                    <Icon size={22} className="text-void" />
                  </span>
                  <span className="text-[11px] font-medium text-ink-muted">{label}</span>
                </>
              ) : (
                <>
                  <Icon size={20} />
                  {label}
                </>
              )
            }
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
