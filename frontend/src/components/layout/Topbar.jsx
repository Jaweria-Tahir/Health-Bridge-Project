import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
import Orb from "../ui/Orb.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Topbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const firstName = user?.name?.split(" ")[0] || "there";

  const onSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/app/resources?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-glass-hair bg-void/70 px-4 py-3.5 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-2.5 lg:hidden">
        <Orb size="sm" />
      </div>

      <div className="hidden min-w-0 flex-col lg:flex">
        <p className="text-xs text-ink-faint">{greeting},</p>
        <h1 className="truncate font-display text-lg text-ink">{firstName}</h1>
      </div>

      <form onSubmit={onSearch} className="ml-auto flex w-full max-w-md items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources, articles…"
            className="input-field !py-2 pl-9 text-sm"
            aria-label="Search"
          />
        </div>
      </form>

      <button
        onClick={() => navigate("/app/assistant")}
        className="btn-primary hidden !px-4 !py-2 text-sm sm:inline-flex"
      >
        <Sparkles size={16} />
        Ask AI
      </button>
    </header>
  );
}
