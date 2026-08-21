import { MapPin, Phone, Clock, ArrowUpRight } from "lucide-react";
import Badge from "./Badge.jsx";
import { formatCategory } from "../../utils/roles.js";

const CATEGORY_TONE = {
  clinic: "info",
  vaccination: "good",
  emergency: "bad",
  mental_wellness: "violet",
  preventive_care: "warn",
  public_health: "neutral",
};

export default function ResourceCard({ resource, onOpen, compact = false }) {
  return (
    <button
      onClick={() => onOpen?.(resource)}
      className="glass-panel group flex w-full flex-col gap-3 p-5 text-left transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-3">
        <Badge tone={CATEGORY_TONE[resource.category] || "neutral"}>{formatCategory(resource.category)}</Badge>
        <ArrowUpRight size={16} className="shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <h3 className="font-display text-base text-ink">{resource.name}</h3>
      {!compact && <p className="line-clamp-2 text-sm text-ink-muted">{resource.description}</p>}
      <div className="mt-1 space-y-1.5 text-xs text-ink-faint">
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="shrink-0" />
          <span className="truncate">{resource.location}</span>
        </div>
        {!compact && (
          <>
            <div className="flex items-center gap-1.5">
              <Phone size={13} className="shrink-0" />
              <span className="truncate">{resource.contactInformation}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="shrink-0" />
              <span className="truncate">{resource.availability}</span>
            </div>
          </>
        )}
      </div>
    </button>
  );
}
