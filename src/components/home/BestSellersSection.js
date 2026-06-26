'use client';
import { useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const TABS = ['All', 'Organic', 'Flash Sale', 'New'];

export default function BestSellersSection({ products = [] }) {
  const [tab, setTab] = useState('All');

  const filtered = products.filter(p => {
    if (tab === 'Organic') return p.isOrganic;
    if (tab === 'Flash Sale') return p.isFlashSale;
    if (tab === 'New') return p.isNewArrival;
    return p.isBestSeller || p.isFeatured;
  }).slice(0, 8);

  return (
    <section className="section">
      <div className="page-container">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: 4 }}>Customer Favourites</p>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>Best Sellers</h2>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`filter-chip${tab === t ? ' active' : ''}`}
                style={{ fontSize: 12 }}>
                {t}
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--slate)', padding: '40px 0' }}>No products in this category yet.</p>
        ) : (
          <div className="product-grid">
            {filtered.map((p, i) => <ProductCard key={p.id || p._id} product={p} index={i} />)}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link href="/products" className="btn-outline" style={{ display: 'inline-flex' }}>
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
