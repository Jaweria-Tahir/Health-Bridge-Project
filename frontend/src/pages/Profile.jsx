import { LogOut, Mail, ShieldCheck, Calendar } from "lucide-react";
import GlassCard from "../components/ui/GlassCard.jsx";
import Orb from "../components/ui/Orb.jsx";
import Badge from "../components/ui/Badge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { roleLabel } from "../utils/roles.js";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl text-ink">Your Profile</h1>
        <p className="text-sm text-ink-muted">Account details and session controls.</p>
      </div>

      <GlassCard className="flex flex-col items-center gap-4 py-10 text-center">
        <Orb size="lg" />
        <div>
          <h2 className="font-display text-xl text-ink">{user?.name}</h2>
          <Badge tone="info" className="mt-2">
            {roleLabel(user?.role)}
          </Badge>
        </div>
      </GlassCard>

      <GlassCard className="space-y-4">
        <Row icon={Mail} label="Email" value={user?.email} />
        <Row icon={ShieldCheck} label="Role" value={roleLabel(user?.role)} />
        {user?.createdAt && (
          <Row icon={Calendar} label="Member since" value={new Date(user.createdAt).toLocaleDateString()} />
        )}
      </GlassCard>

      <button onClick={logout} className="btn-secondary w-full !text-signal-bad hover:!bg-signal-bad/10">
        <LogOut size={16} />
        Sign out
      </button>
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 border-b border-glass-hair pb-4 last:border-0 last:pb-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-bridge-sky">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-ink-faint">{label}</p>
        <p className="text-sm text-ink">{value}</p>
      </div>
    </div>
  );
}
