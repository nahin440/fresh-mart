'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const BANNERS = [
  {
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80',
    label: 'Certified', title: 'Organic\nRange', sub: 'Pesticide-free. Better for you, better for the planet.',
    cta: 'Shop Organic', href: '/products?organic=true',
  },
  {
    image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&q=80',
    label: 'Sustainably Caught', title: 'Fresh\nSeafood', sub: 'Wild-caught and delivered within 24 hours of landing.',
    cta: 'Explore Fish', href: '/products?category=Meat+%26+Seafood',
  },
];

export default function FeaturedBannerSection() {
  return (
    <section className="section">
      <div className="page-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {BANNERS.map((b, i) => (
            <Link key={i} href={b.href}
              style={{ display: 'block', position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-img)', minHeight: 340, textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1.06)'; }}
              onMouseLeave={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1)'; }}>
              <img src={b.image} alt={b.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, padding: 28 }}>
                <span className="tag tag-green" style={{ marginBottom: 12, display: 'inline-flex' }}>{b.label}</span>
                <h3 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.1, marginBottom: 10, whiteSpace: 'pre-line' }}>{b.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 18, lineHeight: 1.5 }}>{b.sub}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 13, fontWeight: 500 }}>
                  {b.cta} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
