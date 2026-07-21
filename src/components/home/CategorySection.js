'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const PALETTE = ['#e8f8ef', '#fef9e7', '#fdf2e9', '#f4ecfb', '#e8f0fe', '#fce4ec', '#e3f2fd'];

export default function CategorySection({ categories = [] }) {
  if (categories.length === 0) return null;

  return (
    <section className="section-sm" style={{ background: 'var(--off-white)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(1.25rem, 3vw, 2rem)', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span className="eyebrow">Browse</span>
            <h2 className="t-h2">Shop by Category</h2>
          </div>
          <Link href="/categories" className="btn btn-ghost" style={{ color: 'var(--slate)', display: 'flex', alignItems: 'center', gap: 4 }}>
            View All Categories <ArrowRight size={14} />
          </Link>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop (see .hscroll in globals.css) */}
        <div className="hscroll" style={{ '--gap': '0.875rem' }}>
          {categories.map((cat, i) => (
            <Link key={cat.slug || cat._id} href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="afu cat-tile"
              style={{
                animationDelay: `${i * 0.06}s`,
                flexShrink: 0,
                width: 'clamp(110px, 22vw, 145px)',
                display: 'block',
              }}>
              <div className="cat-tile-inner" style={{ borderRadius: 16, overflow: 'hidden', background: PALETTE[i % PALETTE.length], aspectRatio: '1/1', position: 'relative' }}>
                {cat.image && (
                  <img src={cat.image} alt={cat.name} className="cat-tile-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; }} />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', bottom: '0.625rem', left: 0, right: 0, textAlign: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)', letterSpacing: '-0.01em', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{cat.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
