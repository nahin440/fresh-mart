'use client';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function NewArrivalsSection({ products = [] }) {
  const newOnes = products.filter(p => p.isNewArrival).slice(0, 4);
  if (!newOnes.length) return null;

  return (
    <section className="section" style={{ background: 'var(--canvas)' }}>
      <div className="page-container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Sparkles size={14} style={{ color: 'var(--violet)' }} />
              <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--violet)' }}>Just Landed</p>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>New Arrivals</h2>
          </div>
          <Link href="/products?newArrival=true" className="btn-ghost" style={{ color: 'var(--slate)', display: 'inline-flex', gap: 4, fontSize: 13 }}>
            See All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="product-grid">
          {newOnes.map((p, i) => <ProductCard key={p.id || p._id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}
