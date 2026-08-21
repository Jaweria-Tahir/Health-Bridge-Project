import { ArrowUpRight, BookOpen } from "lucide-react";
import Badge from "./Badge.jsx";
import { formatCategory } from "../../utils/roles.js";

export default function EducationCard({ item, onOpen }) {
  return (
    <button
      onClick={() => onOpen?.(item)}
      className="glass-panel group flex w-full flex-col gap-3 p-5 text-left transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bridge-violet/10 text-bridge-magenta">
          <BookOpen size={16} />
        </div>
        <ArrowUpRight size={16} className="shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div>
        <Badge tone="violet" className="mb-2">
          {formatCategory(item.category)}
        </Badge>
        <h3 className="font-display text-base leading-snug text-ink">{item.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink-muted">{item.summary}</p>
      </div>
      {item.createdBy?.name && <p className="mt-auto text-xs text-ink-faint">By {item.createdBy.name}</p>}
    </button>
  );
}
