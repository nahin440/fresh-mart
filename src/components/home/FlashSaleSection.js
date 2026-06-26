'use client';
import { useState, useEffect, useRef } from 'react';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';

// Fixed: targetTime stored in ref so it never changes between renders
function useCountdown() {
  const targetRef = useRef(null);
  if (!targetRef.current) {
    targetRef.current = Date.now() + 8 * 3600000 + 23 * 60000 + 45000;
  }
  const [time, setTime] = useState({ h: 8, m: 23, s: 45 });

  useEffect(() => {
    const tick = () => {
      const diff = targetRef.current - Date.now();
      if (diff <= 0) { setTime({ h: 0, m: 0, s: 0 }); return; }
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []); // empty deps — runs once only

  return time;
}

function CountdownUnit({ value, label }) {
  return (
    <div className="countdown-unit">
      <span className="countdown-num">{String(value).padStart(2, '0')}</span>
      <span className="countdown-lbl">{label}</span>
    </div>
  );
}

export default function FlashSaleSection({ products = [] }) {
  const { h, m, s } = useCountdown();
  const saleProducts = products.filter(p => p.isFlashSale).slice(0, 4);
  if (!saleProducts.length) return null;

  return (
    <section style={{ background: 'var(--near-black)', padding: '64px 0' }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, background: '#ef4444', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              className="animate-pulse">
              <Zap size={22} color="#fff" fill="#fff" />
            </div>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ef4444', marginBottom: 2 }}>Limited Time</p>
              <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff' }}>Flash Sale</h2>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--slate)', marginRight: 4 }}>Ends in:</span>
            <CountdownUnit value={h} label="HRS" />
            <span style={{ color: 'var(--slate)', fontWeight: 700 }}>:</span>
            <CountdownUnit value={m} label="MIN" />
            <span style={{ color: 'var(--slate)', fontWeight: 700 }}>:</span>
            <CountdownUnit value={s} label="SEC" />
          </div>
        </div>

        {/* Products */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 20 }}>
          <div className="product-grid">
            {saleProducts.map((p, i) => (
              <ProductCard key={p.id || p._id} product={p} index={i} />
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link href="/products?flashSale=true" className="btn-outline"
            style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff', display: 'inline-flex' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--ink)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}>
            View All Flash Deals <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
