'use client';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProductsSection({ products = [] }) {
  const featured = products.filter(p => p.isFeatured).slice(0, 8);
  if (!featured.length) return null;
  return (
    <section className="section">
      <div className="page-container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: 4 }}>Handpicked</p>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>Editor's Selection</h2>
          </div>
          <Link href="/products" className="btn-ghost" style={{ color: 'var(--slate)', display: 'inline-flex', gap: 4, fontSize: 13 }}>
            Browse All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((p, i) => <ProductCard key={p.id || p._id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}
