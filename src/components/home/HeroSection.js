'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, Truck, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=80',
    eyebrow: 'Certified Organic',
    title: 'Pure Food,\nPure Living',
    sub: 'Hand-picked from sustainable farms. Zero compromise on quality.',
    cta: 'Shop Now', href: '/products',
  },
  {
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1400&q=80',
    eyebrow: 'Flash Sale — Up to 30% Off',
    title: "Today's\nBest Deals",
    sub: 'Incredible savings on our most loved products. Limited time.',
    cta: 'View Deals', href: '/products?flashSale=true',
  },
  {
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1400&q=80',
    eyebrow: 'New This Week',
    title: 'Fresh\nArrivals',
    sub: 'Discover our newest additions — from exotic superfoods to seasonal produce.',
    cta: 'Explore New', href: '/products?newArrival=true',
  },
];

const TRUST = [
  { icon: Leaf, text: '100% Organic' },
  { icon: Truck, text: 'Free Delivery £50+' },
  { icon: Shield, text: 'Freshness Guaranteed' },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef(null);

  const go = (idx) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setPrev(current);
    setCurrent(idx);
    setTimeout(() => { setPrev(null); setAnimating(false); }, 700);
  };

  const next = () => go((current + 1) % SLIDES.length);
  const back = () => go((current - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    intervalRef.current = setInterval(next, 5500);
    return () => clearInterval(intervalRef.current);
  }, [current]);

  const slide = SLIDES[current];

  return (
    <section style={{ position: 'relative', height: 'min(88vh, 680px)', overflow: 'hidden', background: '#111' }}>
      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div key={i} style={{ position: 'absolute', inset: 0, transition: 'opacity 0.7s ease', opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
          <img src={s.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: i === current ? 'scale(1)' : 'scale(1.04)', transition: 'transform 6s ease' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)' }} />
        </div>
      ))}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
        <div className="page-container" style={{ width: '100%' }}>
          <div style={{ maxWidth: 520 }}>
            <p className="anim-fade-up" key={`ey-${current}`}
              style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-green-light)', marginBottom: 16, animationDuration: '0.5s' }}>
              {slide.eyebrow}
            </p>
            <h1 className="anim-fade-up delay-100" key={`h-${current}`}
              style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1.05, color: '#fff', marginBottom: 20, animationDuration: '0.5s', whiteSpace: 'pre-line' }}>
              {slide.title}
            </h1>
            <p className="anim-fade-up delay-200" key={`s-${current}`}
              style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 32, animationDuration: '0.5s' }}>
              {slide.sub}
            </p>
            <div className="anim-fade-up delay-300 flex flex-wrap gap-3" key={`c-${current}`} style={{ animationDuration: '0.5s', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={slide.href} className="btn-violet" style={{ fontSize: 15, padding: '14px 28px' }}>
                {slide.cta} <ArrowRight size={16} />
              </Link>
              <Link href="/products"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.3)', borderRadius: 'var(--radius-pill)', padding: '14px 28px', fontSize: 15, color: '#fff', textDecoration: 'none', backdropFilter: 'blur(6px)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                All Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      {[{ fn: back, icon: ChevronLeft, side: 'left' }, { fn: next, icon: ChevronRight, side: 'right' }].map(({ fn, icon: Icon, side }) => (
        <button key={side} onClick={fn}
          style={{ position: 'absolute', [side]: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 3, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(6px)', transition: 'all 0.2s' }}
          className="hide-mobile"
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
          <Icon size={20} />
        </button>
      ))}

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', gap: 6 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            style={{ width: i === current ? 24 : 7, height: 7, borderRadius: 99, background: i === current ? '#fff' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }} />
        ))}
      </div>

      {/* Trust bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3, borderTop: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', background: 'rgba(0,0,0,0.35)', padding: '14px 0' }}>
        <div className="page-container" style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          {TRUST.map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.8)' }}>
              <Icon size={15} style={{ color: 'var(--accent-green-light)' }} />
              <span style={{ fontSize: 12, letterSpacing: '-0.01em' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
