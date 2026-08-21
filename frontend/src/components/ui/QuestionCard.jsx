import { MessageCircle } from "lucide-react";
import Badge from "./Badge.jsx";
import { formatCategory } from "../../utils/roles.js";

const STATUS_TONE = { pending: "warn", reviewed: "info", answered: "good" };

export default function QuestionCard({ question, footer }) {
  return (
    <div className="glass-panel flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bridge-sky/10 text-bridge-sky">
            <MessageCircle size={15} />
          </div>
          <Badge tone="neutral">{formatCategory(question.category)}</Badge>
        </div>
        <Badge tone={STATUS_TONE[question.status] || "neutral"}>{question.status}</Badge>
      </div>

      <p className="text-sm text-ink">{question.question}</p>

      {question.answer ? (
        <div className="rounded-xl border border-bridge-sky/20 bg-bridge-sky/[0.05] p-3 text-sm text-ink-muted">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-bridge-sky">Answer</p>
          {question.answer}
        </div>
      ) : (
        <p className="text-xs italic text-ink-faint">Awaiting a response from the health team.</p>
      )}

      {question.submittedBy?.name && (
        <p className="text-xs text-ink-faint">Asked by {question.submittedBy.name}</p>
      )}

      {footer}
    </div>
  );
}
