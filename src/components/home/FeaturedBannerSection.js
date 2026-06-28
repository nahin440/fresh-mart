'use client';
import Link from 'next/link';
import { ArrowRight, Leaf, Fish } from 'lucide-react';

export default function FeaturedBannerSection() {
  return (
    <section className="section-sm" style={{ background: 'var(--off-white)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1rem' }}>

          {/* Banner 1 — tall left */}
          <Link href="/products?organic=true"
            style={{ display: 'block', position: 'relative', overflow: 'hidden', borderRadius: 20, minHeight: 'clamp(240px,45vw,400px)', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1.07)'; }}
            onMouseLeave={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1)'; }}>
            <img src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=900&q=85"
              alt="Organic"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }} />
            <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem' }}>
              <span className="tag tag-green"><Leaf size={10} /> Certified Organic</span>
            </div>
            <div style={{ position: 'absolute', bottom: '1.75rem', left: '1.75rem', right: '1.75rem' }}>
              <h3 className="t-h2" style={{ color: '#fff', marginBottom: '0.5rem', lineHeight: 1.15 }}>The Organic<br />Collection</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>100% pesticide-free. Better for you, better for the planet.</p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 600, fontSize: '0.875rem', borderBottom: '1.5px solid rgba(255,255,255,0.4)', paddingBottom: '2px', transition: 'border-color 0.2s' }}>
                Shop Organic <ArrowRight size={15} />
              </span>
            </div>
          </Link>

          {/* Right column — 2 stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                img: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=700&q=85',
                tag: '🐟 Sustainably Caught',
                tagCls: 'tag-white',
                title: 'Fresh Seafood',
                sub: 'Wild-caught. Delivered within 24hrs.',
                href: '/products?category=Meat+%26+Seafood',
                gradient: 'linear-gradient(to top, rgba(0,0,0,0.78), transparent)',
              },
              {
                img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&q=85',
                tag: '🍞 Artisan Baked',
                tagCls: 'tag-amber',
                title: 'Fresh Bakery',
                sub: 'Baked every morning, stone-ground flour.',
                href: '/products?category=Bakery+%26+Bread',
                gradient: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
              },
            ].map((b, i) => (
              <Link key={i} href={b.href}
                style={{ display: 'block', position: 'relative', overflow: 'hidden', borderRadius: 20, flex: 1, minHeight: 'clamp(150px, 22vw, 192px)', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1.07)'; }}
                onMouseLeave={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1)'; }}>
                <img src={b.img} alt={b.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.65s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: b.gradient }} />
                <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                  <span className={`tag ${b.tagCls}`} style={{ fontSize: '0.6875rem' }}>{b.tag}</span>
                </div>
                <div style={{ position: 'absolute', bottom: '1rem', left: '1.25rem', right: '1.25rem' }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', letterSpacing: '-0.025em', marginBottom: '0.25rem' }}>{b.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem' }}>{b.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
