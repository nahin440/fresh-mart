'use client';
import { useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const TABS = [
  { label: 'All Stars', filter: p => p.isBestSeller || p.isFeatured },
  { label: 'Organic',   filter: p => p.isOrganic },
  { label: 'On Sale',   filter: p => p.isFlashSale },
  { label: 'New In',    filter: p => p.isNewArrival },
];

export default function BestSellersSection({ products = [] }) {
  const [tab, setTab] = useState(0);
  const list = products.filter(TABS[tab].filter).slice(0, 8);

  return (
    <section className="section" style={{ background: '#fff' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', marginBottom: 'clamp(1.5rem,4vw,2.25rem)' }}>
          <div>
            <span className="eyebrow">Customer Favourites</span>
            <h2 className="t-h2">Best Sellers</h2>
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {TABS.map((t, i) => (
              <button key={t.label} onClick={() => setTab(i)} className={`chip${tab === i ? ' active' : ''}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {list.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem 0' }}>No products in this category yet.</p>
        ) : (
          <div className="product-grid">
            {list.map((p, i) => <ProductCard key={p.id || p._id} product={p} index={i} />)}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/products" className="btn btn-outline">
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
