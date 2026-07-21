'use client';
import { useState, useEffect } from 'react';
import { Tags, Loader, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { ImageDropzone } from '@/components/admin/ImageDropzone';

const COLORS = [
  { key: 'violet', label: 'Violet', swatch: 'var(--violet)' },
  { key: 'green', label: 'Green', swatch: 'var(--green)' },
  { key: 'red', label: 'Red', swatch: '#e74c3c' },
  { key: 'dark', label: 'Dark', swatch: 'var(--ink)' },
  { key: 'blue', label: 'Blue', swatch: '#2980ef' },
];

export default function AddTypePage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [color, setColor] = useState('violet');
  const [saving, setSaving] = useState(false);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch('/api/types').then(r => r.json())
      .then(d => { setTypes(d.types || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Type name is required'); return; }
    setSaving(true);
    try {
      const r = await fetch('/api/types', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim(), image, color }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Could not save');
      toast.success('Type added!');
      setName(''); setDescription(''); setImage(''); setColor('violet');
      load();
    } catch (err) { toast.error(err.message); }
    setSaving(false);
  };

  return (
    <div style={{ padding: 'clamp(1.5rem,4vw,2.5rem)', maxWidth: 860 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>Types</h1>
        <p style={{ color: 'var(--slate)', fontSize: '0.9375rem' }}>Manage product types like New Arrivals, Best Sellers, or Organic. A product can have more than one type.</p>
      </div>

      <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--hairline)' }}>Add New Type</h3>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Limited Edition" className="input" required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>Description</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" className="input" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>Image</label>
            <ImageDropzone value={image} onChange={setImage} label="Drag & drop an image for this type, or click to browse" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.5rem' }}>Badge Color</label>
            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button type="button" key={c.key} onClick={() => setColor(c.key)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.875rem', borderRadius: 100, border: `1.5px solid ${color === c.key ? c.swatch : 'var(--hairline)'}`, background: color === c.key ? 'var(--canvas)' : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: c.swatch, display: 'inline-block' }} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <button type="submit" disabled={saving}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--violet)', color: '#fff', borderRadius: 100, padding: '0.75rem 1.75rem', fontSize: '0.875rem', fontWeight: 700, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'inherit' }}>
              {saving ? <><Loader size={15} className="spin" /> Saving...</> : <><Check size={15} /> Add Type</>}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--hairline)' }}>
          Existing Types {!loading && `(${types.length})`}
        </h3>
        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Loading…</p>
        ) : types.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>No types yet — add your first one above.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
            {types.map(t => {
              const swatch = COLORS.find(c => c.key === t.color)?.swatch || 'var(--violet)';
              return (
                <div key={t.slug || t._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.875rem', borderRadius: 100, background: 'var(--canvas)' }}>
                  {t.image ? (
                    <img src={t.image} alt="" style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                  ) : (
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: swatch, display: 'inline-block' }} />
                  )}
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{t.name}</span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--muted)', fontFamily: 'monospace' }}>/{t.slug}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
