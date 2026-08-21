import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Orb from "../components/ui/Orb.jsx";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-void px-4 text-center">
      <Orb size="lg" />
      <div>
        <h1 className="font-display text-3xl text-ink">Page not found</h1>
        <p className="mt-2 text-sm text-ink-muted">The page you're looking for doesn't exist or has moved.</p>
      </div>
      <Link to="/" className="btn-primary">
        <ArrowLeft size={16} />
        Back to home
      </Link>
    </div>
  );
}
