'use client';
import { Leaf, Truck, RefreshCw, Shield, Award, Clock } from 'lucide-react';

const FEATURES = [
  { icon: Leaf,      title: 'Certified Organic',    desc: 'Every product certified to strict organic standards from verified farms worldwide.' },
  { icon: Truck,     title: 'Free Delivery',         desc: 'Complimentary next-day delivery on all orders over £50 anywhere in the UK.' },
  { icon: Clock,     title: 'Same-Day by 2pm',       desc: 'Order before 2pm for same-day delivery. We never keep you waiting.' },
  { icon: Shield,    title: 'Freshness Guarantee',   desc: '100% freshness guarantee on everything we sell — or your money back, instantly.' },
  { icon: RefreshCw, title: 'Easy Returns',          desc: 'Not happy? Return anything within 24 hours. No questions, no hassle.' },
  { icon: Award,     title: 'Award Winning',         desc: 'Voted UK\'s Best Online Grocer 2024 by Which? Magazine readers.' },
];

export default function TrustSection() {
  return (
    <section className="section" style={{ background: 'var(--near-black)', position: 'relative', overflow: 'hidden' }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: '50%', height: '160%', background: 'radial-gradient(circle, rgba(84,51,235,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '40%', height: '100%', background: 'radial-gradient(circle, rgba(26,122,74,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem,6vw,4rem)' }}>
          <span className="eyebrow" style={{ color: 'var(--green-light)', justifyContent: 'center' }}>
            <span style={{ background: 'var(--green-light)' }} />
            Why FreshMart
          </span>
          <h2 className="t-h2" style={{ color: '#fff' }}>The FreshMart Promise</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(0.875rem,2vw,1rem)', marginTop: '0.75rem', maxWidth: 480, margin: '0.75rem auto 0' }}>
            Six reasons why 50,000+ customers trust us with their weekly shop.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 'clamp(1rem, 3vw, 1.75rem)' }}>
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="afu" style={{ animationDelay: `${i * 0.07}s` }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 'clamp(1.25rem, 4vw, 1.75rem)', height: '100%', transition: 'all 0.25s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(84,51,235,0.15)'; e.currentTarget.style.borderColor = 'rgba(84,51,235,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(84,51,235,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon size={20} style={{ color: '#a78bfa' }} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
