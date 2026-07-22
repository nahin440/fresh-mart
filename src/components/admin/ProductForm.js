'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { ImageDropzone, MultiImageDropzone } from './ImageDropzone';
import DescriptionEditor from './DescriptionEditor';

const LEGACY_FLAG_TO_SLUG = {
  isFlashSale: 'flash-sale', isNewArrival: 'new-arrivals', isFeatured: 'featured',
  isBestSeller: 'best-seller', isOrganic: 'organic',
};

const DEF = {
  name: '', slug: '', category: '', subcategory: '', price: '', originalPrice: '', discount: '',
  unit: '', weight: '', stock: '', rating: '4.5', reviews: '0', description: '', highlights: '',
  image: '', images: [], tags: '', types: [],
  cal: '', fat: '', carbs: '', protein: '', fiber: '',
};

// Derives the pill selection for products saved before `types` existed —
// falls back to whatever legacy booleans (isOrganic etc.) are already true,
// so opening an old product for editing doesn't silently show it as
// type-less and wipe those flags out on the next save.
const deriveInitialTypes = (initial) => {
  if (Array.isArray(initial.types) && initial.types.length) return initial.types;
  return Object.entries(LEGACY_FLAG_TO_SLUG).filter(([flag]) => initial[flag]).map(([, slug]) => slug);
};

// Field and Card must live outside ProductForm, not inside it. A component
// defined inside another component's function body gets recreated (a new
// function reference) on every re-render of the parent — and ProductForm
// re-renders on every keystroke (each keystroke calls setForm). React
// treats a new function reference as a brand-new component type, so it
// unmounts and remounts the whole subtree, including the <input> itself,
// which drops focus after every character. Keeping these at module scope
// gives them a stable identity so React just updates props instead of
// tearing the DOM node down and rebuilding it.
const Field = ({ label, k, form, set, type = 'text', ph = '', req, hint, half }) => (
  <div style={{ gridColumn: half ? 'auto' : '1/-1' }}>
    <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>
      {label}{req && <span style={{ color: '#e74c3c' }}> *</span>}
    </label>
    <input type={type} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph} required={req} className="input" />
    {hint && <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{hint}</p>}
  </div>
);

const Card = ({ title, children, action }) => (
  <div className="admin-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--hairline)' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

export default function ProductForm({ initial = {}, mode = 'add', productId }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [form, setForm] = useState({
    ...DEF, ...initial,
    highlights: Array.isArray(initial.highlights) ? initial.highlights.join('\n') : initial.highlights || '',
    images: Array.isArray(initial.images) ? initial.images : (initial.images ? initial.images.split('\n').map(s => s.trim()).filter(Boolean) : []),
    tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : initial.tags || '',
    types: deriveInitialTypes(initial),
    cal: initial.nutrition?.calories || '', fat: initial.nutrition?.fat || '', carbs: initial.nutrition?.carbs || '', protein: initial.nutrition?.protein || '', fiber: initial.nutrition?.fiber || '',
  });

  // Load categories & types for the dropdown/multi-select. Falls back
  // gracefully — if these fetches fail (e.g. Mongo not connected yet and
  // the demo-mode JSON somehow errors too) the selects just render empty
  // rather than crashing the whole form.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [catRes, typeRes] = await Promise.all([
          fetch('/api/categories').then(r => r.json()),
          fetch('/api/types').then(r => r.json()),
        ]);
        if (cancelled) return;
        const cats = catRes.categories || [];
        const tps = typeRes.types || [];
        setCategories(cats);
        setTypes(tps);
        // Only backfill a default category on ADD mode, and only once we
        // know what's available — editing an existing product must never
        // have its saved category silently overwritten by this effect.
        setForm(f => (mode === 'add' && !f.category && cats.length) ? { ...f, category: cats[0].name } : f);
      } catch {
        if (!cancelled) toast.error('Could not load categories/types');
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    })();
    return () => { cancelled = true; };
  }, [mode]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const autoSlug = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const toggleType = (slug) => {
    setForm(f => ({
      ...f,
      types: f.types.includes(slug) ? f.types.filter(t => t !== slug) : [...f.types, slug],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) { toast.error('Name and price are required'); return; }
    if (!form.category) { toast.error('Please select a category'); return; }
    setSaving(true);
    const payload = {
      name: form.name.trim(), slug: form.slug || autoSlug(form.name), category: form.category, subcategory: form.subcategory,
      price: parseFloat(form.price), originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      discount: form.discount ? parseInt(form.discount) : undefined, unit: form.unit, weight: form.weight,
      stock: parseInt(form.stock) || 0, rating: parseFloat(form.rating) || 4.5, reviews: parseInt(form.reviews) || 0,
      description: form.description,
      highlights: form.highlights.split('\n').map(s => s.trim()).filter(Boolean),
      image: form.image, images: form.images,
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      types: form.types,
      nutrition: { calories: form.cal, fat: form.fat, carbs: form.carbs, protein: form.protein, fiber: form.fiber },
      isActive: true,
    };
    try {
      const r = await fetch(mode === 'edit' ? `/api/products/${productId}` : '/api/products', { method: mode === 'edit' ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error();
      toast.success(mode === 'edit' ? 'Product updated!' : 'Product added!');
      router.push('/admin/goingintodeep/products');
    } catch { toast.error('Could not save — check MongoDB is connected.'); }
    setSaving(false);
  };


  return (
    <form onSubmit={submit}>
      <Card title="Basic Information">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1/-1' }}><Field form={form} set={set} label="Product Name" k="name" req ph="e.g. Organic Hass Avocados" /></div>
          <Field form={form} set={set} label="URL Slug" k="slug" ph="auto-generated" hint="Leave blank to auto-generate" half />
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>Category *</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} className="input" disabled={loadingOptions} required>
              {!form.category && <option value="" disabled>{loadingOptions ? 'Loading…' : 'Select a category'}</option>}
              {categories.map(c => <option key={c.slug || c._id} value={c.name}>{c.name}</option>)}
            </select>
            {!loadingOptions && categories.length === 0 && (
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                No categories yet — add one from the Categories page first.
              </p>
            )}
          </div>
          <Field form={form} set={set} label="Subcategory" k="subcategory" ph="e.g. Fruits" half />
          <Field form={form} set={set} label="Unit" k="unit" ph="e.g. pack of 4" half />
          <Field form={form} set={set} label="Weight/Volume" k="weight" ph="e.g. 600g" half />
        </div>
      </Card>

      <Card title="Pricing & Inventory">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
          <Field form={form} set={set} label="Sale Price (£)" k="price" type="number" req ph="4.99" half />
          <Field form={form} set={set} label="Original Price (£)" k="originalPrice" type="number" ph="6.99" half />
          <Field form={form} set={set} label="Discount %" k="discount" type="number" ph="29" half />
          <Field form={form} set={set} label="Stock Qty" k="stock" type="number" ph="50" half />
        </div>
      </Card>

      <Card title="Images">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>Main Image</label>
            <ImageDropzone value={form.image} onChange={v => set('image', v)} label="Drag & drop the main product image, or click to browse" />
            <input
              type="text" value={form.image} onChange={e => set('image', e.target.value)}
              placeholder="…or paste an image URL directly" className="input"
              style={{ marginTop: '0.625rem', fontSize: '0.8125rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>Additional Images</label>
            <MultiImageDropzone urls={form.images} onChange={v => set('images', v)} />
          </div>
        </div>
      </Card>

      <Card title="Description & Content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>Description</label>
            <DescriptionEditor value={form.description} onChange={v => set('description', v)} placeholder="Detailed product description..." />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>Highlights (one per line)</label>
            <textarea value={form.highlights} onChange={e => set('highlights', e.target.value)} rows={4} className="input" style={{ resize: 'vertical' }} placeholder={"Certified organic\nRich in Omega-3"} />
          </div>
          <Field form={form} set={set} label="Tags (comma separated)" k="tags" ph="organic, vegan, keto" />
        </div>
      </Card>

      <Card title="Nutrition (per 100g)">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '0.875rem' }}>
          {[['cal', 'Calories', '160'], ['fat', 'Fat', '15g'], ['carbs', 'Carbs', '9g'], ['protein', 'Protein', '2g'], ['fiber', 'Fibre', '7g']].map(([k, l, ph]) => (
            <div key={k}>
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>{l}</label>
              <input type="text" value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph} className="input" />
            </div>
          ))}
        </div>
      </Card>

      <Card title="Rating & Reviews">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field form={form} set={set} label="Rating (0–5)" k="rating" type="number" ph="4.5" half />
          <Field form={form} set={set} label="Review Count" k="reviews" type="number" ph="124" half />
        </div>
      </Card>

      <Card title="Product Types" action={<span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Select any that apply</span>}>
        {loadingOptions ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Loading types…</p>
        ) : types.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>No types yet — add one from the Types page first.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
            {types.map(t => (
              <button
                type="button" key={t.slug || t._id}
                className={`pill-toggle${form.types.includes(t.slug) ? ' active' : ''}`}
                onClick={() => toggleType(t.slug)}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}
      </Card>

      <div style={{ display: 'flex', gap: '0.75rem', paddingBottom: '2rem' }}>
        <button type="submit" disabled={saving}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--violet)', color: '#fff', borderRadius: 100, padding: '0.875rem 2rem', fontSize: '0.9375rem', fontWeight: 700, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, boxShadow: 'var(--violet-glow)', transition: 'all 0.2s', fontFamily: 'inherit' }}>
          {saving ? <><Loader size={16} className="spin" /> Saving...</> : <><Save size={16} />{mode === 'edit' ? 'Update Product' : 'Add Product'}</>}
        </button>
        <button type="button" onClick={() => router.back()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff', color: 'var(--ink)', borderRadius: 100, padding: '0.875rem 1.75rem', fontSize: '0.9375rem', border: '1.5px solid var(--hairline)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
