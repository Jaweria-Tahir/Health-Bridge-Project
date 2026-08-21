export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-glass-border py-14 px-6 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04] text-bridge-sky">
          <Icon size={22} />
        </div>
      )}
      <h3 className="font-display text-lg text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-muted">{description}</p>}
      {action}
    </div>
  );
}
