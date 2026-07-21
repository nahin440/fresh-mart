'use client';
import { useState, useEffect } from 'react';
import { ListTree, Loader, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { ImageDropzone } from '@/components/admin/ImageDropzone';

export default function AddCategoryPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch('/api/categories').then(r => r.json())
      .then(d => { setCategories(d.categories || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Category name is required'); return; }
    setSaving(true);
    try {
      const r = await fetch('/api/categories', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim(), image: image.trim() }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Could not save');
      toast.success('Category added!');
      setName(''); setDescription(''); setImage('');
      load();
    } catch (err) { toast.error(err.message); }
    setSaving(false);
  };

  return (
    <div style={{ padding: 'clamp(1.5rem,4vw,2.5rem)', maxWidth: 860 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>Categories</h1>
        <p style={{ color: 'var(--slate)', fontSize: '0.9375rem' }}>Manage the categories products can be listed under. A product belongs to exactly one category.</p>
      </div>

      <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--hairline)' }}>Add New Category</h3>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Frozen Foods" className="input" required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>Description</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description shown in category listings" className="input" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>Image</label>
            <ImageDropzone value={image} onChange={setImage} label="Drag & drop a category image, or click to browse" />
          </div>
          <div>
            <button type="submit" disabled={saving}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--violet)', color: '#fff', borderRadius: 100, padding: '0.75rem 1.75rem', fontSize: '0.875rem', fontWeight: 700, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'inherit' }}>
              {saving ? <><Loader size={15} className="spin" /> Saving...</> : <><Check size={15} /> Add Category</>}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--hairline)' }}>
          Existing Categories {!loading && `(${categories.length})`}
        </h3>
        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Loading…</p>
        ) : categories.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>No categories yet — add your first one above.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {categories.map(c => (
              <div key={c.slug || c._id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.625rem 0.75rem', borderRadius: 10, background: 'var(--canvas)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {c.image ? <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} /> : <ListTree size={16} style={{ color: 'var(--muted)' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{c.name}</p>
                  {c.description && <p style={{ fontSize: '0.75rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description}</p>}
                </div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--muted)', fontFamily: 'monospace' }}>/{c.slug}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
