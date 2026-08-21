import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Plus, MapPin, Phone, Clock, Sparkles, Trash2, Pencil } from "lucide-react";
import GlassCard from "../components/ui/GlassCard.jsx";
import Loader from "../components/ui/Loader.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Badge from "../components/ui/Badge.jsx";
import Modal from "../components/ui/Modal.jsx";
import ResourceCard from "../components/ui/ResourceCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { isStaff, formatCategory } from "../utils/roles.js";
import {
  fetchResources,
  searchResources,
  createResource,
  updateResource,
  deleteResource,
  analyzeResource,
} from "../api/resources.js";
import { getErrorMessage } from "../api/client.js";

const CATEGORIES = ["clinic", "vaccination", "emergency", "mental_wellness", "preventive_care", "public_health"];

const EMPTY_FORM = {
  name: "",
  category: "clinic",
  description: "",
  location: "",
  contactInformation: "",
  availability: "",
};

export default function Resources() {
  const { user } = useAuth();
  const staff = isStaff(user?.role);
  const [searchParams, setSearchParams] = useSearchParams();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const load = async (q = query, cat = category) => {
    setLoading(true);
    try {
      const data = q || cat ? await searchResources({ q: q || undefined, category: cat || undefined }) : await fetchResources();
      setResources(data.resources || []);
    } catch {
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(searchParams.get("q") || "", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitSearch = (e) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
    load(query, category);
  };

  const onCategoryClick = (cat) => {
    const next = category === cat ? "" : cat;
    setCategory(next);
    load(query, next);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setFormOpen(true);
  };

  const openEdit = (resource) => {
    setEditing(resource);
    setForm({
      name: resource.name,
      category: resource.category,
      description: resource.description,
      location: resource.location,
      contactInformation: resource.contactInformation,
      availability: resource.availability,
    });
    setError("");
    setSelected(null);
    setFormOpen(true);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await updateResource(editing._id, form);
      } else {
        await createResource(form);
      }
      setFormOpen(false);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (resource) => {
    if (!window.confirm(`Delete "${resource.name}"? This can't be undone.`)) return;
    try {
      await deleteResource(resource._id);
      setSelected(null);
      load();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const onAnalyze = async (resource) => {
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const data = await analyzeResource(resource._id);
      setAnalysis(data.analysis);
    } catch (err) {
      setAnalysis({ error: getErrorMessage(err, "Analysis service unavailable.") });
    } finally {
      setAnalyzing(false);
    }
  };

  const grouped = useMemo(() => resources, [resources]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Community Resources</h1>
          <p className="text-sm text-ink-muted">Clinics, vaccination centers, and support lines near you.</p>
        </div>
        {staff && (
          <button onClick={openCreate} className="btn-primary self-start !px-4 !py-2 text-sm sm:self-auto">
            <Plus size={16} />
            Add resource
          </button>
        )}
      </div>

      <div className="glass-panel p-4">
        <form onSubmit={onSubmitSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, description, or location…"
              className="input-field pl-9 text-sm"
            />
          </div>
          <button type="submit" className="btn-secondary !px-5 text-sm">
            Search
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryClick(cat)}
              className={`chip transition-colors ${category === cat ? "!border-bridge-sky/60 !text-bridge-sky" : "hover:text-ink"}`}
            >
              {formatCategory(cat)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader label="Loading resources" />
      ) : grouped.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No resources found"
          description="Try a different search term or category filter."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} onOpen={setSelected} />
          ))}
        </div>
      )}

      {/* Detail modal */}
      <Modal open={Boolean(selected)} onClose={() => { setSelected(null); setAnalysis(null); }} title={selected?.name} wide>
        {selected && (
          <div className="space-y-4">
            <Badge tone="info">{formatCategory(selected.category)}</Badge>
            <p className="text-sm leading-relaxed text-ink-muted">{selected.description}</p>
            <div className="grid grid-cols-1 gap-3 rounded-xl bg-white/[0.03] p-4 text-sm sm:grid-cols-3">
              <Detail icon={MapPin} label="Location" value={selected.location} />
              <Detail icon={Phone} label="Contact" value={selected.contactInformation} />
              <Detail icon={Clock} label="Availability" value={selected.availability} />
            </div>

            {staff && (
              <div className="flex flex-wrap gap-2 pt-1">
                <button onClick={() => openEdit(selected)} className="btn-secondary !px-4 !py-2 text-sm">
                  <Pencil size={14} /> Edit
                </button>
                <button onClick={() => onAnalyze(selected)} disabled={analyzing} className="btn-secondary !px-4 !py-2 text-sm">
                  <Sparkles size={14} /> {analyzing ? "Analyzing…" : "AI Analyze"}
                </button>
                {user?.role === "admin" && (
                  <button
                    onClick={() => onDelete(selected)}
                    className="btn-secondary !px-4 !py-2 text-sm !text-signal-bad hover:!bg-signal-bad/10"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            )}

            {analysis && (
              <div className="rounded-xl border border-bridge-violet/25 bg-bridge-violet/[0.06] p-4 text-sm text-ink-muted">
                {analysis.error ? (
                  <span className="text-signal-bad">{analysis.error}</span>
                ) : (
                  <pre className="whitespace-pre-wrap font-body text-xs leading-relaxed">
                    {JSON.stringify(analysis, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create / edit modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit resource" : "Add a resource"} wide>
        <form onSubmit={onSave} className="space-y-3">
          {error && <p className="text-sm text-signal-bad">{error}</p>}
          <Field label="Name">
            <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Category">
            <select
              className="input-field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-void-700">
                  {formatCategory(c)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Description">
            <textarea
              required
              rows={3}
              className="input-field resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Location">
              <input required className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Field>
            <Field label="Contact information">
              <input
                required
                className="input-field"
                value={form.contactInformation}
                onChange={(e) => setForm({ ...form, contactInformation: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Availability">
            <input
              required
              placeholder="e.g. Mon–Fri, 9am–5pm"
              className="input-field"
              value={form.availability}
              onChange={(e) => setForm({ ...form, availability: e.target.value })}
            />
          </Field>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "Saving…" : editing ? "Save changes" : "Create resource"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={14} className="mt-0.5 shrink-0 text-bridge-sky" />
      <div>
        <p className="text-[11px] uppercase tracking-wide text-ink-faint">{label}</p>
        <p className="text-ink">{value}</p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-muted">{label}</span>
      {children}
    </label>
  );
}
