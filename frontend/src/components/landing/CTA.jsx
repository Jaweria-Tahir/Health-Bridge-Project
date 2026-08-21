import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section id="trust" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="glass-panel flex flex-col items-start gap-3 border-signal-good/20 bg-signal-good/[0.04] p-6 sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-signal-good/10 text-signal-good">
            <ShieldCheck size={20} />
          </div>
          <p className="text-sm leading-relaxed text-ink-muted">
            <span className="font-medium text-ink">Educational information only.</span> HealthBridge's AI never
            diagnoses conditions or prescribes treatment. For symptoms, emergencies, or personal medical
            decisions, always consult a licensed healthcare provider or emergency services.
          </p>
        </div>

        <div className="glass-panel mt-8 flex flex-col items-center gap-5 p-10 text-center shadow-glow-lg">
          <h2 className="text-3xl text-ink sm:text-4xl">Ready to bring clarity to your community?</h2>
          <p className="max-w-lg text-ink-muted">
            Create a free account to start asking, learning, and finding real resources near you.
          </p>
          <Link to="/register" className="btn-primary">
            Create your account
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
