import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Orb from "../ui/Orb.jsx";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
      <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-bridge-blue/20 blur-[140px]" />

      <nav className="relative z-10 mx-auto mb-16 flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Orb size="sm" />
          <span className="font-display text-lg text-ink">HealthBridge</span>
        </div>
        <div className="hidden items-center gap-8 text-sm text-ink-muted md:flex">
          <a href="#features" className="transition-colors hover:text-ink">Platform</a>
          <a href="#how-it-works" className="transition-colors hover:text-ink">How it works</a>
          <a href="#trust" className="transition-colors hover:text-ink">Trust &amp; safety</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost !px-4 text-sm">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">
            Get started
          </Link>
        </div>
      </nav>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="chip mb-6"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-signal-good" />
          Trusted community health guidance, grounded in real sources
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-4xl leading-[1.08] text-ink sm:text-5xl lg:text-6xl"
        >
          Talk to <span className="text-gradient">HealthBridge AI</span>
          <br className="hidden sm:block" /> — clear answers, real resources.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-6 max-w-2xl text-balance text-base text-ink-muted sm:text-lg"
        >
          Ask health questions in plain language, find nearby clinics and vaccination
          centers, and get educational guidance grounded in a curated knowledge base —
          never a diagnosis, always a next step.
        </motion.p>
        <motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.18 }}
  className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
>
  <Link to="/register" className="btn-primary">
    Start for free
    <ArrowRight size={16} />
  </Link>
  <Link to="/login" className="btn-secondary">
    I already have an account
  </Link>
</motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="relative mt-16 flex flex-col items-center"
        >
          <Orb size="xl" state="listening" />
          <p className="mt-3 text-xs text-ink-faint">Every answer includes a clear educational disclaimer</p>
        </motion.div>
      </div>
    </section>
  );
}
