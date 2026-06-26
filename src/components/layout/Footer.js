'use client';
import Link from 'next/link';
import { Leaf, Globe, MessageCircle, Mail, ArrowRight, Share2 } from 'lucide-react';

const COLS = [
  { title: 'Shop', links: [['Fresh Produce', '/products?category=Fruits+%26+Vegetables'], ['Dairy & Eggs', '/products?category=Dairy+%26+Eggs'], ['Bakery', '/products?category=Bakery+%26+Bread'], ['Pantry', '/products?category=Pantry+%26+Dry+Goods'], ['All Products', '/products']] },
  { title: 'Company', links: [['About Us', '#'], ['Sustainability', '#'], ['Careers', '#'], ['Press', '#'], ['Blog', '#']] },
  { title: 'Support', links: [['FAQ', '#'], ['Delivery Info', '#'], ['Returns', '#'], ['Contact Us', '#'], ['Track Order', '#']] },
];

const SOCIALS = [Globe, MessageCircle, Mail, Share2];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--near-black)', color: '#fff' }}>
      {/* Newsletter */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '48px 0' }}>
        <div className="page-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-green-light)', marginBottom: 8 }}>Newsletter</p>
            <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Get 10% off your first order</h3>
            <p style={{ fontSize: 13, color: 'var(--concrete)' }}>Weekly deals, seasonal recipes & new arrivals.</p>
          </div>
          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 8, minWidth: 300, flexWrap: 'wrap' }}>
            <input type="email" placeholder="Your email address" required
              style={{ flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-pill)', padding: '12px 20px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'inherit' }} />
            <button type="submit" style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--violet)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: 'var(--shadow-violet)' }}>
              Subscribe <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="page-container" style={{ padding: '48px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 32 }}>
        <div>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, textDecoration: 'none' }}>
            <div style={{ background: 'var(--accent-green)', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={14} color="#fff" />
            </div>
            <span style={{ color: '#fff', fontWeight: 700, letterSpacing: '-0.04em', fontSize: 16 }}>FRESHMART</span>
          </Link>
          <p style={{ fontSize: 12, color: 'var(--concrete)', lineHeight: 1.7, marginBottom: 20, maxWidth: 200 }}>
            Premium organic groceries delivered to your door. Sourced sustainably, packed responsibly.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {SOCIALS.map((Icon, i) => (
              <a key={i} href="#"
                style={{ width: 32, height: 32, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--concrete)', transition: 'all 0.15s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet)'; e.currentTarget.style.background = 'var(--violet)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--concrete)'; }}>
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {COLS.map(col => (
          <div key={col.title}>
            <p style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 16, fontWeight: 600 }}>{col.title}</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} style={{ fontSize: 13, color: 'var(--concrete)', textDecoration: 'none', transition: 'color 0.15s', letterSpacing: '-0.02em' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'var(--concrete)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px' }}>
        <div className="page-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--slate)' }}>
          <span>© 2025 FreshMart Ltd. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <Link key={t} href="#" style={{ color: 'var(--slate)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'var(--slate)'}>
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
