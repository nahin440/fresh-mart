'use client';
import { useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BestSellersSection({ products = [], types = [] }) {
  // "All" is a pseudo-tab that isn't a real Type document — it just shows
  // the top-rated/best-selling products with no type filter applied, so the
  // section still has something sensible to show even before any types
  // have been tagged onto products.
  const tabs = [
    { label: 'All', slug: null },
    ...types.map(t => ({ label: t.name, slug: t.slug })),
  ];
  const [tab, setTab] = useState(0);

  const activeSlug = tabs[tab]?.slug;
  const list = (activeSlug
    ? products.filter(p => Array.isArray(p.types) && p.types.includes(activeSlug))
    : [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0))
  ).slice(0, 8);

  return (
    <section className="section" style={{ background: '#fff' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', marginBottom: 'clamp(1.5rem,4vw,2.25rem)' }}>
          <div>
            <span className="eyebrow">Customer Favourites</span>
            <h2 className="t-h2">Shop by Type</h2>
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {tabs.map((t, i) => (
              <button key={t.slug || 'all'} onClick={() => setTab(i)} className={`chip${tab === i ? ' active' : ''}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {list.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem 0' }}>No products tagged with this type yet.</p>
        ) : (
          <div className="product-grid">
            {list.map((p, i) => <ProductCard key={p.id || p._id} product={p} index={i} />)}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <Link href="/types" className="btn btn-outline">
            View All Types <ArrowRight size={16} />
          </Link>
          <Link href="/products" className="btn btn-ghost">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
