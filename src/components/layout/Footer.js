'use client';
import Link from 'next/link';
import { Leaf, Globe, MessageCircle, Mail, ArrowRight, Share2 } from 'lucide-react';

const COLS = [
  { title: 'Shop',    links: [['Fresh Produce', '/products?category=Fruits+%26+Vegetables'], ['Dairy & Eggs', '/products?category=Dairy+%26+Eggs'], ['Bakery', '/products?category=Bakery+%26+Bread'], ['Pantry', '/products?category=Pantry+%26+Dry+Goods'], ['All Products', '/products']] },
  { title: 'Company', links: [['About Us','#'],['Sustainability','#'],['Careers','#'],['Press','#'],['Blog','#']] },
  { title: 'Support', links: [['FAQ','#'],['Delivery Info','#'],['Returns','#'],['Contact Us','#'],['Track Order','#']] },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--near-black)', color: '#fff' }}>
      {/* Top CTA strip */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: 'clamp(2.5rem,6vw,4rem) 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green-light)', marginBottom: '0.75rem', fontWeight: 700 }}>Newsletter</p>
            <h3 style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Get 10% off your first order</h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>Weekly deals, seasonal recipes & new arrivals from FreshMart.</p>
          </div>
          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            <input type="email" placeholder="Your email address" required
              style={{ flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '0.875rem 1.25rem', fontSize: '0.9375rem', color: '#fff', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.35)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
            <button type="submit" className="btn btn-violet" style={{ flexShrink: 0 }}>
              Subscribe <ArrowRight size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* Links grid */}
      <div className="container" style={{ padding: 'clamp(2.5rem,6vw,4rem) 0 clamp(1.5rem,4vw,2.5rem)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '2.5rem' }}>
        {/* Brand */}
        <div style={{ gridColumn: '1 / -1', maxWidth: 280 }} className="show-mobile">
          <BrandCol />
        </div>
        <div className="hide-mobile">
          <BrandCol />
        </div>
        {COLS.map(col => (
          <div key={col.title}>
            <p style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem', fontWeight: 700 }}>{col.title}</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem 0' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)' }}>© 2025 FreshMart Ltd. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {['Privacy', 'Terms', 'Cookies'].map(t => (
              <Link key={t} href="#" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)', transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}>
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function BrandCol() {
  return (
    <>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, var(--green), #27ae60)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Leaf size={14} color="#fff" />
        </div>
        <span style={{ fontWeight: 800, letterSpacing: '-0.04em', fontSize: '1rem' }}>FRESHMART</span>
      </Link>
      <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
        Premium organic groceries delivered to your door. Sustainably sourced, beautifully packaged.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {[Globe, MessageCircle, Mail, Share2].map((Icon, i) => (
          <a key={i} href="#"
            style={{ width: 34, height: 34, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--violet)'; e.currentTarget.style.borderColor = 'var(--violet)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
            <Icon size={15} />
          </a>
        ))}
      </div>
    </>
  );
}
