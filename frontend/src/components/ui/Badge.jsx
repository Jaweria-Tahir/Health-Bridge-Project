const TONES = {
  neutral: "bg-white/[0.06] text-ink-muted border-glass-border",
  good: "bg-signal-good/10 text-signal-good border-signal-good/30",
  warn: "bg-signal-warn/10 text-signal-warn border-signal-warn/30",
  bad: "bg-signal-bad/10 text-signal-bad border-signal-bad/30",
  info: "bg-bridge-sky/10 text-bridge-sky border-bridge-sky/30",
  violet: "bg-bridge-violet/10 text-bridge-magenta border-bridge-violet/30",
};

export default function Badge({ tone = "neutral", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
