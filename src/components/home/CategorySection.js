'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CATS = [
  { name: 'Fruits & Veg', emoji: '🥦', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80', href: '/products?category=Fruits+%26+Vegetables', color: '#e8f8ef' },
  { name: 'Dairy & Eggs', emoji: '🥛', image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&q=80', href: '/products?category=Dairy+%26+Eggs', color: '#fef9e7' },
  { name: 'Bakery',       emoji: '🍞', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', href: '/products?category=Bakery+%26+Bread', color: '#fdf2e9' },
  { name: 'Pantry',       emoji: '🫙', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80', href: '/products?category=Pantry+%26+Dry+Goods', color: '#f4ecfb' },
  { name: 'Meat & Fish',  emoji: '🐟', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80', href: '/products?category=Meat+%26+Seafood', color: '#e8f0fe' },
  { name: 'Beverages',    emoji: '☕', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80', href: '/products?category=Beverages', color: '#fce4ec' },
  { name: 'Snacks',       emoji: '🍫', image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&q=80', href: '/products?category=Snacks+%26+Confectionery', color: '#e3f2fd' },
];

export default function CategorySection() {
  return (
    <section className="section-sm" style={{ background: 'var(--off-white)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(1.25rem, 3vw, 2rem)', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span className="eyebrow">Browse</span>
            <h2 className="t-h2">Shop by Category</h2>
          </div>
          <Link href="/products" className="btn btn-ghost" style={{ color: 'var(--slate)', display: 'flex', alignItems: 'center', gap: 4 }}>
            See all <ArrowRight size={14} />
          </Link>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="hscroll" style={{ '--gap': '0.875rem' }}>
          {CATS.map((cat, i) => (
            <Link key={cat.name} href={cat.href}
              className="afu"
              style={{
                animationDelay: `${i * 0.06}s`,
                flexShrink: 0,
                width: 'clamp(110px, 22vw, 145px)',
                display: 'block',
              }}>
              <div style={{ borderRadius: 16, overflow: 'hidden', background: cat.color, transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1)', aspectRatio: '1/1', position: 'relative' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05) rotate(-1deg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) rotate(0deg)'; }}>
                <img src={cat.image} alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseEnter={e => { e.target.style.transform = 'scale(1.1)'; }}
                  onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', bottom: '0.625rem', left: 0, right: 0, textAlign: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)', letterSpacing: '-0.01em', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{cat.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop grid (hidden on mobile) */}
        <div className="hide-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.875rem', marginTop: '-2rem' }}>
          {/* This shows on desktop alongside the scroll - we handle via CSS */}
        </div>
      </div>
    </section>
  );
}
