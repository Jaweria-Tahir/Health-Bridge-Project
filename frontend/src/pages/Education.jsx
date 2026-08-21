import { useEffect, useState } from "react";
import { Search, Plus, BookOpen, Trash2, Pencil } from "lucide-react";
import Loader from "../components/ui/Loader.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Badge from "../components/ui/Badge.jsx";
import Modal from "../components/ui/Modal.jsx";
import EducationCard from "../components/ui/EducationCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { isStaff, formatCategory } from "../utils/roles.js";
import {
  fetchEducation,
  searchEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../api/education.js";
import { getErrorMessage } from "../api/client.js";

const CATEGORIES = ["nutrition", "hygiene", "vaccination", "first_aid", "preventive_care", "healthy_lifestyle"];

const EMPTY_FORM = { title: "", category: "nutrition", summary: "", content: "", source: "", status: "published" };

export default function Education() {
  const { user } = useAuth();
  const staff = isStaff(user?.role);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async (q = query, cat = category) => {
    setLoading(true);
    try {
      const data = q || cat ? await searchEducation({ q: q || undefined, category: cat || undefined }) : await fetchEducation();
      setItems(data.education || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitSearch = (e) => {
    e.preventDefault();
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

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      category: item.category,
      summary: item.summary,
      content: item.content,
      source: item.source,
      status: item.status,
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
        await updateEducation(editing._id, form);
      } else {
        await createEducation(form);
      }
      setFormOpen(false);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This can't be undone.`)) return;
    try {
      await deleteEducation(item._id);
      setSelected(null);
      load();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Health Education</h1>
          <p className="text-sm text-ink-muted">Curated, published guidance from verified organizations.</p>
        </div>
        {staff && (
          <button onClick={openCreate} className="btn-primary self-start !px-4 !py-2 text-sm sm:self-auto">
            <Plus size={16} />
            New article
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
              placeholder="Search articles…"
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
        <Loader label="Loading articles" />
      ) : items.length === 0 ? (
        <EmptyState icon={BookOpen} title="No articles found" description="Try a different search term or category." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <EducationCard key={item._id} item={item} onOpen={setSelected} />
          ))}
        </div>
      )}

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.title} wide>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge tone="violet">{formatCategory(selected.category)}</Badge>
              <Badge tone={selected.status === "published" ? "good" : "neutral"}>{selected.status}</Badge>
            </div>
            <p className="text-sm font-medium text-ink">{selected.summary}</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">{selected.content}</p>
            <p className="text-xs text-ink-faint">Source: {selected.source}</p>
            {selected.createdBy?.name && <p className="text-xs text-ink-faint">Published by {selected.createdBy.name}</p>}

            {staff && (
              <div className="flex flex-wrap gap-2 pt-1">
                <button onClick={() => openEdit(selected)} className="btn-secondary !px-4 !py-2 text-sm">
                  <Pencil size={14} /> Edit
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
          </div>
        )}
      </Modal>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit article" : "New article"} wide>
        <form onSubmit={onSave} className="space-y-3">
          {error && <p className="text-sm text-signal-bad">{error}</p>}
          <Field label="Title">
            <input required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Category">
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-void-700">
                    {formatCategory(c)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="published" className="bg-void-700">Published</option>
                <option value="draft" className="bg-void-700">Draft</option>
              </select>
            </Field>
          </div>
          <Field label="Summary">
            <textarea
              required
              rows={2}
              className="input-field resize-none"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </Field>
          <Field label="Content">
            <textarea
              required
              rows={6}
              className="input-field resize-none"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </Field>
          <Field label="Source">
            <input required className="input-field" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
          </Field>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "Saving…" : editing ? "Save changes" : "Publish article"}
          </button>
        </form>
      </Modal>
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
