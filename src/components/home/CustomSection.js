'use client';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CustomSection({ products = [], title, subtitle, limit = 8, filterType, filterCategory }) {
  const list = products
    .filter(p => {
      if (filterType) return Array.isArray(p.types) && p.types.includes(filterType);
      if (filterCategory) return p.category === filterCategory;
      return true;
    })
    .slice(0, limit);

  if (!list.length) return null;

  const viewAllHref = filterType
    ? `/products?type=${encodeURIComponent(filterType)}`
    : filterCategory
      ? `/products?category=${encodeURIComponent(filterCategory)}`
      : '/products';

  return (
    <section className="section" style={{ background: 'var(--off-white)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(1.5rem,4vw,2.25rem)', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="eyebrow">Curated</span>
            <h2 className="t-h2">{title}</h2>
            {subtitle && <p className="t-body" style={{ marginTop: '0.5rem', maxWidth: 420 }}>{subtitle}</p>}
          </div>
          <Link href={viewAllHref} className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--slate)', flexShrink: 0 }}>
            See All <ArrowRight size={15} />
          </Link>
        </div>
        <div className="product-grid">
          {list.map((p, i) => <ProductCard key={p.id || p._id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}
