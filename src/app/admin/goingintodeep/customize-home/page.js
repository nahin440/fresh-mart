'use client';
import { useState, useEffect } from 'react';
import { LayoutTemplate, ChevronUp, ChevronDown, Trash2, Plus, Eye, EyeOff, Loader, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const KIND_LABELS = {
  hero: 'Hero Banner', 'category-strip': 'Category Strip', 'best-sellers': 'Shop by Type (tabs)',
  'flash-sale': 'Flash Sale', banner: 'Promo Banner', 'new-arrivals': 'New Arrivals',
  featured: 'Editor\'s Selection', custom: 'Custom Section', testimonials: 'Testimonials',
  trust: 'Trust Badges', newsletter: 'Newsletter Signup',
};

// Which kinds have a product limit that makes sense to edit, and which have
// a title an admin would actually want to rename (the purely decorative
// kinds — hero, trust badges, newsletter — don't take products or benefit
// from a custom title, so their rows stay simple toggle-and-reorder only).
const HAS_LIMIT = new Set(['best-sellers', 'flash-sale', 'new-arrivals', 'featured', 'custom']);
const HAS_TITLE = new Set(['best-sellers', 'flash-sale', 'new-arrivals', 'featured', 'custom']);

export default function CustomizeHomePage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [secRes, catRes, typeRes] = await Promise.all([
          fetch('/api/home-sections').then(r => r.json()),
          fetch('/api/categories').then(r => r.json()),
          fetch('/api/types').then(r => r.json()),
        ]);
        if (cancelled) return;
        setSections(secRes.sections || []);
        setCategories(catRes.categories || []);
        setTypes(typeRes.types || []);
      } catch {
        if (!cancelled) toast.error('Could not load homepage sections');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const update = (i, patch) => {
    setSections(list => list.map((s, idx) => idx === i ? { ...s, ...patch } : s));
    setDirty(true);
  };

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    setSections(list => {
      const copy = [...list];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
    setDirty(true);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const r = await fetch('/api/home-sections', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Could not save');
      setSections(data.sections);
      setDirty(false);
      toast.success('Homepage updated!');
    } catch (err) { toast.error(err.message); }
    setSaving(false);
  };

  const deleteSection = async (i) => {
    const s = sections[i];
    if (!confirm(`Remove "${s.title || KIND_LABELS[s.kind]}" from the homepage?`)) return;
    if (s._id) {
      try {
        const r = await fetch(`/api/home-sections/${s._id}`, { method: 'DELETE' });
        if (!r.ok) throw new Error();
      } catch { toast.error('Could not delete — check MongoDB is connected.'); return; }
    }
    setSections(list => list.filter((_, idx) => idx !== i));
    toast.success('Section removed');
  };

  return (
    <div style={{ padding: 'clamp(1.5rem,4vw,2.5rem)', maxWidth: 860 }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>Customize Homepage</h1>
          <p style={{ color: 'var(--slate)', fontSize: '0.9375rem' }}>Reorder, hide, or resize any section — no code required.</p>
        </div>
        {dirty && (
          <button onClick={saveAll} disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--violet)', color: '#fff', borderRadius: 100, padding: '0.75rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'inherit', flexShrink: 0 }}>
            {saving ? <><Loader size={15} className="spin" /> Saving...</> : <><Save size={15} /> Save Changes</>}
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Loading…</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {sections.map((s, i) => (
            <div key={s._id || `${s.kind}-${i}`} className="admin-card"
              style={{ padding: '1.125rem 1.25rem', opacity: s.enabled === false ? 0.55 : 1, display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>

              {/* Reorder */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                <button onClick={() => move(i, -1)} disabled={i === 0} className="btn-icon-sm" aria-label="Move up"><ChevronUp size={15} /></button>
                <button onClick={() => move(i, 1)} disabled={i === sections.length - 1} className="btn-icon-sm" aria-label="Move down"><ChevronDown size={15} /></button>
              </div>

              {/* Info + editable fields */}
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: HAS_TITLE.has(s.kind) || HAS_LIMIT.has(s.kind) ? '0.75rem' : 0, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', background: 'var(--canvas)', padding: '0.2rem 0.55rem', borderRadius: 100 }}>
                    {KIND_LABELS[s.kind] || s.kind}
                  </span>
                  {s.kind === 'custom' && (s.filterType || s.filterCategory) && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate)' }}>
                      filtered by {s.filterType ? `type: ${s.filterType}` : `category: ${s.filterCategory}`}
                    </span>
                  )}
                </div>

                {(HAS_TITLE.has(s.kind) || HAS_LIMIT.has(s.kind)) && (
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {HAS_TITLE.has(s.kind) && (
                      <input type="text" value={s.title || ''} onChange={e => update(i, { title: e.target.value })}
                        placeholder="Section title" className="input" style={{ flex: '1 1 200px', fontSize: '0.875rem', padding: '0.5rem 0.75rem' }} />
                    )}
                    {HAS_LIMIT.has(s.kind) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--slate)', whiteSpace: 'nowrap' }}>Show</label>
                        <input type="number" min={1} max={24} value={s.limit ?? 8} onChange={e => update(i, { limit: Number(e.target.value) })}
                          className="input" style={{ width: 64, fontSize: '0.875rem', padding: '0.5rem 0.6rem', textAlign: 'center' }} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Toggle + delete */}
              <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                <button onClick={() => update(i, { enabled: s.enabled === false })} className="btn-icon-sm" aria-label={s.enabled === false ? 'Show section' : 'Hide section'} title={s.enabled === false ? 'Hidden — click to show' : 'Visible — click to hide'}>
                  {s.enabled === false ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {s.kind === 'custom' && (
                  <button onClick={() => deleteSection(i)} className="btn-icon-sm" aria-label="Delete section" style={{ color: '#e74c3c' }}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add custom section */}
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)} className="btn btn-outline"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Custom Section
        </button>
      ) : (
        <AddSectionForm categories={categories} types={types}
          onCancel={() => setShowAdd(false)}
          onAdded={(section) => { setSections(list => [...list, section]); setShowAdd(false); toast.success('Section added!'); }} />
      )}
    </div>
  );
}

function AddSectionForm({ categories, types, onCancel, onAdded }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [limit, setLimit] = useState(8);
  const [filterBy, setFilterBy] = useState('type'); // 'type' | 'category'
  const [filterType, setFilterType] = useState(types[0]?.slug || '');
  const [filterCategory, setFilterCategory] = useState(categories[0]?.name || '');
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Section title is required'); return; }
    setSaving(true);
    try {
      const r = await fetch('/api/home-sections', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(), subtitle: subtitle.trim(), limit,
          filterType: filterBy === 'type' ? filterType : undefined,
          filterCategory: filterBy === 'category' ? filterCategory : undefined,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Could not save');
      onAdded(data.section);
    } catch (err) { toast.error(err.message); }
    setSaving(false);
  };

  return (
    <div className="admin-card" style={{ padding: '1.5rem', marginTop: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>New Custom Section</h3>
        <button onClick={onCancel} className="btn-icon-sm" aria-label="Cancel"><X size={16} /></button>
      </div>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>Title *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Organic Products" className="input" required />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>Subtitle (optional)</label>
          <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Short description shown under the title" className="input" />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.5rem' }}>Filter By</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {['type', 'category'].map(opt => (
              <button type="button" key={opt} onClick={() => setFilterBy(opt)}
                className={`pill-toggle${filterBy === opt ? ' active' : ''}`} style={{ textTransform: 'capitalize' }}>
                {opt}
              </button>
            ))}
          </div>
          {filterBy === 'type' ? (
            types.length === 0
              ? <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>No types yet — add one from the Types page first.</p>
              : <select value={filterType} onChange={e => setFilterType(e.target.value)} className="input">
                  {types.map(t => <option key={t.slug} value={t.slug}>{t.name}</option>)}
                </select>
          ) : (
            categories.length === 0
              ? <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>No categories yet — add one from the Categories page first.</p>
              : <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="input">
                  {categories.map(c => <option key={c.slug || c._id} value={c.name}>{c.name}</option>)}
                </select>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>Products to Show</label>
          <input type="number" min={1} max={24} value={limit} onChange={e => setLimit(Number(e.target.value))} className="input" style={{ width: 100 }} />
        </div>

        <div>
          <button type="submit" disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--violet)', color: '#fff', borderRadius: 100, padding: '0.75rem 1.75rem', fontSize: '0.875rem', fontWeight: 700, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'inherit' }}>
            {saving ? <><Loader size={15} className="spin" /> Adding...</> : <><Plus size={15} /> Add Section</>}
          </button>
        </div>
      </form>
    </div>
  );
}
