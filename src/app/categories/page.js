import Link from 'next/link';
import categoriesData from '@/lib/categories.json';

export const metadata = {
  title: 'All Categories — FreshMart',
  description: 'Browse every product category at FreshMart.',
};

const PALETTE = ['#e8f8ef', '#fef9e7', '#fdf2e9', '#f4ecfb', '#e8f0fe', '#fce4ec', '#e3f2fd'];

async function getCategories() {
  try {
    const { connectDB } = await import('@/lib/mongodb');
    const { Category } = await import('@/lib/models');
    const db = await connectDB();
    if (db) {
      const dbCats = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
      if (dbCats.length > 0) return dbCats.map(c => ({ ...c, _id: c._id.toString() }));
    }
  } catch {}
  return categoriesData;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div style={{ minHeight: '70vh', background: 'var(--off-white)' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid var(--hairline)', padding: 'clamp(1.5rem,4vw,2.5rem) 0' }}>
        <div className="container">
          <span className="eyebrow">Browse</span>
          <h1 className="t-h1">All Categories</h1>
        </div>
      </div>

      <div className="container" style={{ padding: 'clamp(1.5rem,4vw,2.5rem) 0' }}>
        {categories.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '4rem 0' }}>No categories yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.25rem' }}>
            {categories.map((cat, i) => (
              <Link key={cat.slug || cat._id} href={`/products?category=${encodeURIComponent(cat.name)}`} className="cat-tile" style={{ display: 'block' }}>
                <div className="cat-tile-inner" style={{ borderRadius: 18, overflow: 'hidden', background: PALETTE[i % PALETTE.length], aspectRatio: '1/1', position: 'relative' }}>
                  {cat.image && (
                    <img src={cat.image} alt={cat.name} className="cat-tile-img"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
                  <div style={{ position: 'absolute', bottom: '0.875rem', left: '0.875rem', right: '0.875rem' }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{cat.name}</span>
                  </div>
                </div>
                {cat.description && (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--slate)', marginTop: '0.625rem' }}>{cat.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
