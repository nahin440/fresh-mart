'use client';
import { useState } from 'react';
import { Mail, ArrowRight, Check, Gift } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(3.5rem,10vw,6rem) 0' }}>
      {/* Animated gradient background */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #5433eb 0%, #7c3aed 35%, #1a7a4a 70%, #5433eb 100%)', backgroundSize: '300% 300%', animation: 'gradShift 10s ease infinite' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 40%)' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.15)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              {done ? <Check size={26} color="#fff" /> : <Gift size={26} color="#fff" />}
            </div>
            <h2 className="t-h2" style={{ color: '#fff', marginBottom: '0.75rem' }}>
              {done ? "You're in! Check your inbox." : 'Get 10% Off Your First Order'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)', lineHeight: 1.7, maxWidth: 380 }}>
              {done
                ? 'Welcome to the FreshMart family! Your exclusive discount code is on its way.'
                : 'Join 50,000+ customers getting weekly deals, seasonal recipes, and exclusive new arrivals.'}
            </p>
          </div>

          {!done && (
            <form onSubmit={e => { e.preventDefault(); if (email) setDone(true); }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="Your email address"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 100, padding: '0.9375rem 1.25rem 0.9375rem 3rem', fontSize: '1rem', color: '#fff', outline: 'none', fontFamily: 'inherit', backdropFilter: 'blur(4px)', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.5)'; e.target.style.boxShadow = '0 0 0 4px rgba(255,255,255,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <button type="submit" className="btn btn-white btn-lg" style={{ justifyContent: 'center', fontWeight: 700 }}>
                Subscribe & Save 10% <ArrowRight size={17} />
              </button>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', textAlign: 'center' }}>
                No spam, ever. Unsubscribe any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
