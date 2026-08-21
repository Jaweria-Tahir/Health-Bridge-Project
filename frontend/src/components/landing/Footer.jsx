import Orb from "../ui/Orb.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-glass-hair px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2.5">
          <Orb size="sm" />
          <span className="font-display text-ink">HealthBridge</span>
        </div>
        <p className="text-xs text-ink-faint">
          &copy; {new Date().getFullYear()} HealthBridge. Educational content only — not a substitute for
          professional medical advice.
        </p>
      </div>
    </footer>
  );
}
