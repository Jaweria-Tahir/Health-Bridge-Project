import { motion } from "framer-motion";
import { Sparkles, MapPinned, BookOpen, MessagesSquare, ShieldCheck, Bot } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Ask AI, grounded in real sources",
    description:
      "The RAG assistant answers only from a curated health knowledge base — nutrition, hygiene, vaccination, first aid, and more — in plain language.",
  },
  {
    icon: Bot,
    title: "Agentic resource finder",
    description:
      "Describe what you need and the agent reaches for live tools — searching clinics, classifying your topic, and returning grounded results.",
  },
  {
    icon: MapPinned,
    title: "Community resource directory",
    description: "Browse clinics, vaccination centers, and helplines by category, location, and availability.",
  },
  {
    icon: BookOpen,
    title: "Curated health education",
    description: "Published articles from verified organizations, searchable by topic and category.",
  },
  {
    icon: MessagesSquare,
    title: "Ask the community team",
    description: "Submit a question directly to health organizations and track the answer as it's reviewed.",
  },
  {
    icon: ShieldCheck,
    title: "Educational, never diagnostic",
    description: "Every AI response carries a clear disclaimer — this is education, not a medical diagnosis.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <p className="chip mx-auto mb-4 w-fit">Platform</p>
          <h2 className="text-3xl text-ink sm:text-4xl">Everything a community needs to stay informed</h2>
          <p className="mt-3 text-ink-muted">
            One place to ask, learn, and find real help — built around a strict educational disclaimer at every step.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="glass-panel group p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-bridge-sky/20 to-bridge-violet/20 text-bridge-sky">
                <Icon size={20} />
              </div>
              <h3 className="mb-2 font-display text-lg text-ink">{title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
