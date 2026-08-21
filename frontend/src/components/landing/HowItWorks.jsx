import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Ask in plain language",
    description: "Type a health question the way you'd ask a friend. No forms, no jargon required.",
  },
  {
    step: "02",
    title: "The assistant retrieves & grounds",
    description: "It searches the knowledge base or live resource directory before answering — never guessing.",
  },
  {
    step: "03",
    title: "You get an answer, sources, and next steps",
    description: "A plain-language answer, cited sources, and a clear disclaimer pointing you to real care when needed.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <p className="chip mx-auto mb-4 w-fit">How it works</p>
          <h2 className="text-3xl text-ink sm:text-4xl">Three steps, grounded every time</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map(({ step, title, description }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <span className="font-mono text-sm text-bridge-sky/70">{step}</span>
              <h3 className="mt-3 font-display text-xl text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{description}</p>
              {i < steps.length - 1 && (
                <div className="mt-6 hidden h-px w-full bg-gradient-to-r from-glass-border to-transparent md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
