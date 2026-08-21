export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-ink-muted">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-glass-border" />
        <div className="absolute inset-0 rounded-full border-2 border-t-bridge-sky border-r-bridge-violet border-b-transparent border-l-transparent animate-spin" />
      </div>
      <p className="text-sm">{label}&hellip;</p>
    </div>
  );
}
