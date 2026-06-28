'use client';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function NewArrivalsSection({ products = [] }) {
  const list = products.filter(p => p.isNewArrival).slice(0, 4);
  if (!list.length) return null;

  return (
    <section className="section" style={{ background: 'var(--canvas)' }}>
      <div className="container">
        {/* Decorative heading */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(1.5rem,4vw,2.25rem)', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Sparkles size={15} style={{ color: 'var(--violet)' }} />
              <span className="eyebrow" style={{ marginBottom: 0 }}>Just Landed</span>
            </div>
            <h2 className="t-h2">New Arrivals</h2>
          </div>
          <Link href="/products?newArrival=true" className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--slate)' }}>
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
