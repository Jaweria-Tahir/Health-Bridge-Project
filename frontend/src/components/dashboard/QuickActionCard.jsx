import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function QuickActionCard({ to, icon: Icon, title, description }) {
  return (
    <Link
      to={to}
      className="glass-panel group flex flex-col gap-3 p-5 transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-bridge-sky/20 to-bridge-violet/20 text-bridge-sky">
          <Icon size={18} />
        </div>
        <ArrowRight size={15} className="text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-ink" />
      </div>
      <div>
        <h3 className="font-display text-sm text-ink">{title}</h3>
        <p className="mt-1 text-xs text-ink-muted">{description}</p>
      </div>
    </Link>
  );
}
