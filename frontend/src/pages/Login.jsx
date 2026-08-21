import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import Orb from "../components/ui/Orb.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../api/client.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/app", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Could not sign in. Check your details and try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4 py-12">
      <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-bridge-violet/15 blur-[130px]" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel relative z-10 w-full max-w-md p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Orb size="md" />
          <h1 className="mt-4 font-display text-2xl text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-muted">Sign in to continue to HealthBridge</p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-signal-bad/30 bg-signal-bad/10 px-3.5 py-2.5 text-sm text-signal-bad">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
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

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign in"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          New to HealthBridge?{" "}
          <Link to="/register" className="font-medium text-bridge-sky hover:underline">
            Create an account
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
