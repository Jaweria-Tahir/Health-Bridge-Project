import { motion } from "framer-motion";
import { ShieldAlert, BookMarked } from "lucide-react";
import Orb from "../ui/Orb.jsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatBubble({ role, content, disclaimer, sources, isError }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <div className="mt-1 shrink-0">
          <Orb size="sm" />
        </div>
      )}

      <div className={`flex max-w-[85%] flex-col gap-2 sm:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-gradient-to-br from-bridge-sky to-bridge-blue text-void"
              : isError
                ? "border border-signal-bad/30 bg-signal-bad/10 text-signal-bad"
                : "glass text-ink"
          }`}
        >
         <div className="prose prose-sm prose-invert max-w-none">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
</div>
        </div>

        {sources?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {sources.map((s, i) => (
              <span key={i} className="chip !py-1 !text-[11px]">
                <BookMarked size={11} />
                {s}
              </span>
            ))}
          </div>
        )}

        {disclaimer && (
          <div className="flex items-start gap-1.5 rounded-xl border border-signal-warn/25 bg-signal-warn/[0.06] px-3 py-2 text-[11px] leading-relaxed text-signal-warn/90">
            <ShieldAlert size={13} className="mt-0.5 shrink-0" />
            <span>{disclaimer}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
