import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import Orb from "../components/ui/Orb.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../api/client.js";

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Use a password with at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      await login({ email: form.email, password: form.password });
      navigate("/app", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Could not create your account. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4 py-12">
      <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-bridge-sky/15 blur-[130px]" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel relative z-10 w-full max-w-md p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Orb size="md" />
          <h1 className="mt-4 font-display text-2xl text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-ink-muted">Join HealthBridge as a community member</p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-signal-bad/30 bg-signal-bad/10 px-3.5 py-2.5 text-sm text-signal-bad">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-ink-muted">
              Full name
            </label>
            <div className="relative">
              <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={onChange}
                placeholder="Alex Rivera"
                className="input-field pl-9"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-ink-muted">
              Email address
            </label>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
                className="input-field pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-ink-muted">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="input-field pl-9"
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirm" className="mb-1.5 block text-xs font-medium text-ink-muted">
                Confirm
              </label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  required
                  value={form.confirm}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="input-field pl-9"
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account…" : "Create account"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-5 flex items-start gap-2 text-xs text-ink-faint">
          <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-signal-good" />
          New accounts join as citizens with access to the assistant, resources, and education library.
        </div>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-bridge-sky hover:underline">
            Sign in
          </Link>
        </p>
        <p className="mt-3 text-center text-xs">
          <Link to="/" className="text-ink-faint hover:text-ink-muted">
            &larr; Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
