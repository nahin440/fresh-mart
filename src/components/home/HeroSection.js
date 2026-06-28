'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Leaf, Zap, Star } from 'lucide-react';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=85',
    accent: '#1a7a4a',
    tag: '🌿 Certified Organic',
    title: 'Nature\'s Best,\nDelivered Fresh',
    sub: 'Farm-to-door in under 24 hours. Taste the difference of truly fresh produce.',
    cta: 'Shop Now', href: '/products',
    stat: [{ n: '50K+', l: 'Happy Customers' }, { n: '500+', l: 'Organic Products' }, { n: '24h', l: 'Delivery' }],
  },
  {
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&q=85',
    accent: '#c0392b',
    tag: '⚡ Flash Sale — Up to 30% Off',
    title: 'Big Savings,\nBig Flavour',
    sub: 'Today\'s best deals on premium groceries. Limited stock — act fast!',
    cta: 'View Deals', href: '/products?flashSale=true',
    stat: [{ n: '30%', l: 'Max Discount' }, { n: '8h', l: 'Remaining' }, { n: '£0', l: 'Delivery £50+' }],
  },
  {
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1600&q=85',
    accent: '#5433eb',
    tag: '✨ New This Week',
    title: 'Discover What\'s\nFresh & New',
    sub: 'Exciting new arrivals from artisan producers and seasonal growers.',
    cta: 'Explore New', href: '/products?newArrival=true',
    stat: [{ n: '20+', l: 'New Items' }, { n: 'Weekly', l: 'New Drops' }, { n: 'Artisan', l: 'Sourced' }],
  },
];

export default function HeroSection() {
  const [cur, setCur]       = useState(0);
  const [anim, setAnim]     = useState(false);
  const timerRef = useRef(null);

  const go = (idx) => {
    if (anim || idx === cur) return;
    setAnim(true);
    setTimeout(() => { setCur(idx); setAnim(false); }, 100);
  };

  const next = () => go((cur + 1) % SLIDES.length);
  const prev = () => go((cur - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 5500);
    return () => clearInterval(timerRef.current);
  }, [cur]);

  const s = SLIDES[cur];

  return (
    <section style={{ position: 'relative', height: 'clamp(520px, 90vh, 760px)', overflow: 'hidden', background: '#0a0a0a' }}>
      {/* Background images */}
      {SLIDES.map((sl, i) => (
        <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === cur ? 1 : 0, transition: 'opacity 0.9s ease', zIndex: i === cur ? 1 : 0 }}>
          <img src={sl.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: i === cur ? 'scale(1.03)' : 'scale(1.1)', transition: 'transform 6s ease' }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(110deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.15) 100%)` }} />
        </div>
      ))}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: '56%', minWidth: 280 }}>
            {/* Tag */}
            <div key={`tag-${cur}`} className="afu" style={{ marginBottom: '1.25rem' }}>
              <span className="tag tag-white" style={{ fontSize: '0.75rem', letterSpacing: '0.06em' }}>{s.tag}</span>
            </div>

            {/* Title */}
            <h1 key={`h-${cur}`} className="t-hero afu d1"
              style={{ color: '#fff', marginBottom: '1.25rem', whiteSpace: 'pre-line', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
              {s.title}
            </h1>

            {/* Sub */}
            <p key={`s-${cur}`} className="afu d2"
              style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(0.9375rem, 2vw, 1.125rem)', lineHeight: 1.65, marginBottom: '2rem', maxWidth: 480 }}>
              {s.sub}
            </p>

            {/* CTAs */}
            <div key={`c-${cur}`} className="afu d3" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link href={s.href} className="btn btn-white btn-lg">
                {s.cta} <ArrowRight size={18} />
              </Link>
              <Link href="/products" className="btn btn-lg glass" style={{ color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                All Products
              </Link>
            </div>

            {/* Stats */}
            <div key={`st-${cur}`} className="afu d4" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {s.stat.map(({ n, l }) => (
                <div key={l}>
                  <div style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', marginTop: 3, letterSpacing: '0.04em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prev/Next */}
      {[
        { fn: prev, icon: ChevronLeft, side: 'left' },
        { fn: next, icon: ChevronRight, side: 'right' },
      ].map(({ fn, icon: Icon, side }) => (
        <button key={side} onClick={fn}
          className="hide-mobile"
          style={{ position: 'absolute', [side]: '1.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 3, width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.28)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}>
          <Icon size={22} />
        </button>
      ))}

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '5.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
        <div className="scroll-dots">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => go(i)} className={`scroll-dot${i === cur ? ' active' : ''}`}
              style={{ background: i === cur ? '#fff' : 'rgba(255,255,255,0.35)', borderColor: 'transparent' }} />
          ))}
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container" style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(1.25rem, 4vw, 3rem)', flexWrap: 'wrap' }}>
          {[['🌿','Certified Organic'],['🚚','Free Delivery £50+'],['⭐','4.9 Rating'],['♻️','Carbon Neutral']].map(([e, t]) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '1rem' }}>{e}</span> {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
