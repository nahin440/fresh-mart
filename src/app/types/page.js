import Link from 'next/link';
import typesData from '@/lib/types.json';

export const metadata = {
  title: 'All Types — FreshMart',
  description: 'Browse products by type — New Arrivals, Best Sellers, Organic and more.',
};

const COLOR_MAP = { violet: 'var(--violet)', green: 'var(--green)', red: '#e74c3c', dark: 'var(--ink)', blue: '#2980ef' };

async function getTypes() {
  try {
    const { connectDB } = await import('@/lib/mongodb');
    const { Type } = await import('@/lib/models');
    const db = await connectDB();
    if (db) {
      const dbTypes = await Type.find({ isActive: true }).sort({ name: 1 }).lean();
      if (dbTypes.length > 0) return dbTypes.map(t => ({ ...t, _id: t._id.toString() }));
    }
  } catch {}
  return typesData;
}

export default async function TypesPage() {
  const types = await getTypes();

  return (
    <div style={{ minHeight: '70vh', background: 'var(--off-white)' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid var(--hairline)', padding: 'clamp(1.5rem,4vw,2.5rem) 0' }}>
        <div className="container">
          <span className="eyebrow">Browse</span>
          <h1 className="t-h1">All Types</h1>
        </div>
      </div>

      <div className="container" style={{ padding: 'clamp(1.5rem,4vw,2.5rem) 0' }}>
        {types.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '4rem 0' }}>No types yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {types.map(t => {
              const swatch = COLOR_MAP[t.color] || COLOR_MAP.violet;
              return (
                <Link key={t.slug || t._id} href={`/products?type=${t.slug}`}
                  style={{ display: 'block', borderRadius: 18, overflow: 'hidden', position: 'relative', aspectRatio: '4/3', background: 'var(--canvas)', border: '1px solid var(--hairline)' }}>
                  {t.image && (
                    <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', top: '0.875rem', left: '0.875rem' }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: swatch, display: 'inline-block', boxShadow: '0 0 0 2px rgba(255,255,255,0.8)' }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: '0.875rem', left: '0.875rem', right: '0.875rem' }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.0625rem', letterSpacing: '-0.01em', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{t.name}</span>
                    {t.description && <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem', marginTop: '0.125rem' }}>{t.description}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
