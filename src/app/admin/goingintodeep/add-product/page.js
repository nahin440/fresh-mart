'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Save, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import 'react-quill-new/dist/quill.snow.css';
import { ImageDropzone, MultiImageDropzone } from '@/components/admin/ImageDropzone';

// react-quill-new touches `document` on load, so it must never render on the
// server — dynamic(..., { ssr: false }) is what makes that safe inside a Next
// app router page. A plain top-level import would break the server build.
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 180, border: '1px solid var(--hairline)', borderRadius: 10, background: 'var(--canvas)' }} />
  ),
});

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};
const QUILL_FORMATS = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'link'];

// A Type's slug links it to these legacy boolean flags, which the storefront
// (home sections, product cards, filters) already reads directly. Setting
// `types` on submit and letting the API/model derive these keeps a product
// created here working everywhere on the site with zero storefront changes.
const LEGACY_TYPE_SLUGS = ['flash-sale', 'new-arrivals', 'featured', 'best-seller', 'organic'];

const DEF = {
  name: '', slug: '', category: '', subcategory: '', price: '', originalPrice: '', discount: '',
  unit: '', weight: '', stock: '', rating: '4.5', reviews: '0', description: '', highlights: '',
  image: '', images: [], tags: '', types: [],
  cal: '', fat: '', carbs: '', protein: '', fiber: '',
};

// Field and Card live outside the page component, not inside it. A component
// defined inside another component's function body gets recreated (a new
// function reference) on every re-render of the parent — and this page
// re-renders on every keystroke (each keystroke calls setForm). React treats
// a new function reference as a brand-new component type, so it unmounts and
// remounts the whole subtree, including the <input> itself, which drops
// focus after every character. Keeping these at module scope gives them a
// stable identity so React just updates props instead of tearing the DOM
// node down and rebuilding it.
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

export default function AddProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [form, setForm] = useState(DEF);

  // Load categories & types for the dropdown/multi-select — same fetch
  // pattern as add-category/add-type's `load()`. Falls back gracefully: if
  // these fetches fail (e.g. Mongo not connected yet), the selects just
  // render empty rather than crashing the whole form.
  const loadOptions = () => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/types').then(r => r.json()),
    ]).then(([catRes, typeRes]) => {
      const cats = catRes.categories || [];
      const tps = typeRes.types || [];
      setCategories(cats);
      setTypes(tps);
      setForm(f => (!f.category && cats.length) ? { ...f, category: cats[0].name } : f);
      setLoadingOptions(false);
    }).catch(() => {
      toast.error('Could not load categories/types');
      setLoadingOptions(false);
    });
  };

  useEffect(loadOptions, []);

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
      const r = await fetch('/api/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Could not save product');
      toast.success('Product added!');
      router.push('/admin/goingintodeep/products');
    } catch (err) {
      toast.error(err.message || 'Could not save product');
    }
    setSaving(false);
  };

  return (
    <div style={{ padding: 'clamp(1.5rem,4vw,2.5rem)', maxWidth: 860 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>Add New Product</h1>
        <p style={{ color: 'var(--slate)', fontSize: '0.9375rem' }}>Fill in the details below to list a new product in your catalogue.</p>
      </div>

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
              <div className="quill-wrap">
                <ReactQuill
                  theme="snow"
                  value={form.description}
                  onChange={v => set('description', v)}
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  placeholder="Detailed product description..."
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.375rem' }}>Highlights (one per line)</label>
              <textarea value={form.highlights} onChange={e => set('highlights', e.target.value)} rows={4} className="input" style={{ resize: 'vertical' }} placeholder={'Certified organic\nRich in Omega-3'} />
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
            {saving ? <><Loader size={16} className="spin" /> Saving...</> : <><Save size={16} /> Add Product</>}
          </button>
          <button type="button" onClick={() => router.back()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff', color: 'var(--ink)', borderRadius: 100, padding: '0.875rem 1.75rem', fontSize: '0.9375rem', border: '1.5px solid var(--hairline)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
