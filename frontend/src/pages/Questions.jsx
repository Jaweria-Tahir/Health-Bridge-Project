import { useEffect, useState } from "react";
import { Send, MessagesSquare } from "lucide-react";
import GlassCard from "../components/ui/GlassCard.jsx";
import Loader from "../components/ui/Loader.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import QuestionCard from "../components/ui/QuestionCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { isStaff, formatCategory } from "../utils/roles.js";
import { submitQuestion, fetchMyQuestions, fetchAllQuestions, updateQuestion } from "../api/questions.js";
import { getErrorMessage } from "../api/client.js";

const CATEGORIES = [
  "general_health",
  "nutrition",
  "hygiene",
  "vaccination",
  "first_aid",
  "preventive_care",
  "mental_wellness",
  "healthy_lifestyle",
];

export default function Questions() {
  const { user } = useAuth();
  const staff = isStaff(user?.role);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ question: "", category: "general_health" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = staff ? await fetchAllQuestions() : await fetchMyQuestions();
      setQuestions(data.questions || []);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staff]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.question.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await submitQuestion(form);
      setForm({ question: "", category: "general_health" });
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = statusFilter ? questions.filter((q) => q.status === statusFilter) : questions;

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl text-ink">{staff ? "Community Questions" : "Ask the Health Team"}</h1>
        <p className="text-sm text-ink-muted">
          {staff
            ? "Review and answer questions submitted by community members."
            : "Submit a question directly to health organizations and track the response."}
        </p>
      </div>

      {!staff && (
        <GlassCard>
          <form onSubmit={onSubmit} className="space-y-3">
            {error && <p className="text-sm text-signal-bad">{error}</p>}
            <textarea
              required
              rows={3}
              placeholder="What would you like to ask?"
              className="input-field resize-none"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <select
                className="input-field sm:max-w-xs"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-void-700">
                    {formatCategory(c)}
                  </option>
                ))}
              </select>
              <button type="submit" disabled={submitting} className="btn-primary sm:w-auto">
                {submitting ? "Submitting…" : "Submit question"}
                <Send size={15} />
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      <div className="flex flex-wrap gap-2">
        {["", "pending", "reviewed", "answered"].map((s) => (
          <button
            key={s || "all"}
            onClick={() => setStatusFilter(s)}
            className={`chip transition-colors ${statusFilter === s ? "!border-bridge-sky/60 !text-bridge-sky" : "hover:text-ink"}`}
          >
            {s ? s : "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading questions" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title="No questions yet"
          description={staff ? "Nothing submitted by the community yet." : "Ask your first question above."}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((q) => (
            <QuestionCard
              key={q._id}
              question={q}
              footer={staff && <ReviewControls question={q} onSaved={load} />}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewControls({ question, onSaved }) {
  const [answer, setAnswer] = useState(question.answer || "");
  const [status, setStatus] = useState(question.status);
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      await updateQuestion(question._id, { answer, status });
      onSaved();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-1 space-y-2 border-t border-glass-hair pt-3">
      <textarea
        rows={2}
        placeholder="Write a response…"
        className="input-field resize-none text-sm"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field flex-1 !py-2 text-sm">
          <option value="pending" className="bg-void-700">Pending</option>
          <option value="reviewed" className="bg-void-700">Reviewed</option>
          <option value="answered" className="bg-void-700">Answered</option>
        </select>
        <button onClick={onSave} disabled={saving} className="btn-secondary !px-4 !py-2 text-sm">
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
