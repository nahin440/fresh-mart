'use client';
import { Leaf, Truck, RefreshCw, Shield, Award, Clock } from 'lucide-react';

const FEATURES = [
  { icon: Leaf, title: 'Certified Organic', desc: 'Every product meets strict organic certification standards from verified farms.' },
  { icon: Truck, title: 'Free Delivery', desc: 'Complimentary delivery on all orders over £50 across the UK.' },
  { icon: Clock, title: 'Same Day Delivery', desc: 'Order before 2pm for same-day delivery straight to your door.' },
  { icon: Shield, title: 'Freshness Guarantee', desc: '100% freshness guarantee or your money back, no questions asked.' },
  { icon: RefreshCw, title: 'Easy Returns', desc: 'Not satisfied? Return within 24 hours — full refund guaranteed.' },
  { icon: Award, title: 'Award Winning', desc: 'Voted best online grocery 2024 by Which? Magazine readers.' },
];

export default function TrustSection() {
  return (
    <section className="section" style={{ background: 'var(--near-black)' }}>
      <div className="page-container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-green-light)', marginBottom: 8 }}>Why FreshMart</p>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff' }}>The FreshMart Promise</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="anim-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div style={{ width: 44, height: 44, background: 'rgba(84,51,235,0.2)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={20} style={{ color: 'var(--violet-glow)' }} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: '#fff', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
