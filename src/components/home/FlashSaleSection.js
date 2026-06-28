'use client';
import { useState, useEffect, useRef } from 'react';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';

function useCountdown() {
  const ref = useRef(Date.now() + 8 * 3600000 + 23 * 60000 + 45000);
  const [t, setT] = useState({ h: 8, m: 23, s: 45 });
  useEffect(() => {
    const tick = () => {
      const diff = ref.current - Date.now();
      if (diff <= 0) return;
      setT({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function FlashSaleSection({ products = [] }) {
  const { h, m, s } = useCountdown();
  const saleProducts = products.filter(p => p.isFlashSale).slice(0, 4);
  if (!saleProducts.length) return null;

  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(3rem,8vw,5rem) 0', background: '#0a0a0a' }}>
      {/* Decorative */}
      <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '45%', height: '140%', background: 'radial-gradient(circle, rgba(84,51,235,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '35%', height: '80%', background: 'radial-gradient(circle, rgba(192,48,43,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem', marginBottom: 'clamp(1.5rem,4vw,2.5rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #c0392b, #e74c3c)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(192,57,43,0.45)' }} className="pulse-anim">
              <Zap size={24} color="#fff" fill="#fff" />
            </div>
            <div>
              <p style={{ fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e74c3c', marginBottom: 2 }}>Limited Time Only</p>
              <h2 className="t-h2" style={{ color: '#fff' }}>Flash Sale</h2>
            </div>
          </div>

          {/* Countdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginRight: '0.25rem' }}>Ends in</span>
            {[{ v: h, l: 'HRS' }, { v: m, l: 'MIN' }, { v: s, l: 'SEC' }].map(({ v, l }, i) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {i > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 900, fontSize: '1.25rem', lineHeight: 1 }}>:</span>}
                <div className="cd-unit" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.5rem 0.75rem', minWidth: 52 }}>
                  <span className="cd-num" style={{ color: '#fff' }}>{String(v).padStart(2, '0')}</span>
                  <span className="cd-lbl" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="product-grid">
          {saleProducts.map((p, i) => <ProductCard key={p.id || p._id} product={p} index={i} />)}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/products?flashSale=true" className="btn btn-lg"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 100, backdropFilter: 'blur(4px)' }}>
            View All Flash Deals <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
