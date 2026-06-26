'use client';
import { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <section style={{ background: 'var(--violet)', padding: '64px 0' }}>
      <div className="page-container" style={{ textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          {done ? <Check size={24} color="#fff" /> : <Mail size={24} color="#fff" />}
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: 10 }}>
          {done ? "You're in! Check your inbox." : 'Get 10% Off Your First Order'}
        </h2>
        {!done && (
          <>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 28 }}>Subscribe for exclusive deals, new arrivals & seasonal recipes.</p>
            <form onSubmit={e => { e.preventDefault(); if (email) setDone(true); }}
              style={{ display: 'flex', gap: 8, maxWidth: 440, margin: '0 auto', flexWrap: 'wrap' }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="Your email address"
                style={{ flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 'var(--radius-pill)', padding: '13px 20px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'inherit' }} />
              <button type="submit"
                style={{ background: '#fff', color: 'var(--violet)', border: 'none', borderRadius: 'var(--radius-pill)', padding: '13px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', flexShrink: 0, fontFamily: 'inherit' }}>
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
