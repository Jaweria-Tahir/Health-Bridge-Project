import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPinned, BookOpen, MessagesSquare, ArrowRight, ShieldCheck } from "lucide-react";
import GlassCard from "../components/ui/GlassCard.jsx";
import Loader from "../components/ui/Loader.jsx";
import Badge from "../components/ui/Badge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchResources } from "../api/resources.js";
import { fetchEducation } from "../api/education.js";
import { fetchAllQuestions } from "../api/questions.js";
import { formatCategory } from "../utils/roles.js";

export default function Manage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [education, setEducation] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const results = await Promise.allSettled([fetchResources(), fetchEducation(), fetchAllQuestions()]);
      if (cancelled) return;
      if (results[0].status === "fulfilled") setResources(results[0].value.resources || []);
      if (results[1].status === "fulfilled") setEducation(results[1].value.education || []);
      if (results[2].status === "fulfilled") setQuestions(results[2].value.questions || []);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const pending = questions.filter((q) => q.status === "pending");
  const drafts = education.filter((e) => e.status === "draft");

  if (loading) return <Loader label="Loading control center" />;

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-up">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bridge-violet/15 text-bridge-magenta">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h1 className="font-display text-2xl text-ink">Control Center</h1>
          <p className="text-sm text-ink-muted">Platform overview for {user?.role === "admin" ? "administrators" : "organizations"}.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={MapPinned} label="Resources" value={resources.length} />
        <StatCard icon={BookOpen} label="Education articles" value={education.length} sub={`${drafts.length} draft`} />
        <StatCard icon={MessagesSquare} label="Total questions" value={questions.length} />
        <StatCard icon={MessagesSquare} label="Pending review" value={pending.length} tone="text-signal-warn" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg text-ink">Needs your attention</h3>
            <Link to="/app/questions" className="flex items-center gap-1 text-xs font-medium text-bridge-sky hover:underline">
              Go to questions <ArrowRight size={12} />
            </Link>
          </div>
          {pending.length === 0 ? (
            <p className="text-sm text-ink-muted">No pending questions right now — you're all caught up.</p>
          ) : (
            <ul className="space-y-3">
              {pending.slice(0, 5).map((q) => (
                <li key={q._id} className="flex items-start justify-between gap-3 border-b border-glass-hair pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">{q.question}</p>
                    <p className="text-xs text-ink-faint">{q.submittedBy?.name || "Community member"}</p>
                  </div>
                  <Badge tone="warn">{formatCategory(q.category)}</Badge>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg text-ink">Content shortcuts</h3>
          </div>
          <div className="space-y-3">
            <Link
              to="/app/resources"
              className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 text-sm text-ink transition-colors hover:bg-white/[0.06]"
            >
              Manage resource directory
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/app/education"
              className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 text-sm text-ink transition-colors hover:bg-white/[0.06]"
            >
              Manage education library
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/app/questions"
              className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 text-sm text-ink transition-colors hover:bg-white/[0.06]"
            >
              Review community questions
              <ArrowRight size={14} />
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, tone = "text-ink" }) {
  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] text-bridge-sky">
        <Icon size={16} />
      </div>
      <div>
        <p className={`font-display text-2xl ${tone}`}>{value}</p>
        <p className="text-xs text-ink-faint">{label}</p>
        {sub && <p className="mt-0.5 text-[11px] text-ink-faint">{sub}</p>}
      </div>
    </GlassCard>
  );
}
