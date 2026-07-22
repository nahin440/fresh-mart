'use client';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProductsSection({ products = [], limit = 8, title = "Editor's Selection", subtitle = "Our team's picks for the finest seasonal and artisan products this week." }) {
  const list = products.filter(p => p.isFeatured).slice(0, limit);
  if (!list.length) return null;

  return (
    <section className="section" style={{ background: '#fff' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(1.5rem,4vw,2.25rem)', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="eyebrow">Handpicked</span>
            <h2 className="t-h2">{title}</h2>
            <p className="t-body" style={{ marginTop: '0.5rem', maxWidth: 420 }}>{subtitle}</p>
          </div>
          <Link href="/products" className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--slate)', flexShrink: 0 }}>
            Browse All <ArrowRight size={15} />
          </Link>
        </div>
        <div className="product-grid">
          {list.map((p, i) => <ProductCard key={p.id || p._id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}
