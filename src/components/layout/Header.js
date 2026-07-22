'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShoppingBag, Heart, Search, Menu, X, Leaf, ArrowRight } from 'lucide-react';

const NAV = [
  { label: 'All Products',  href: '/products' },
  { label: 'Fresh Produce', href: '/products?category=Fruits+%26+Vegetables' },
  { label: 'Dairy & Eggs',  href: '/products?category=Dairy+%26+Eggs' },
  { label: 'Bakery',        href: '/products?category=Bakery+%26+Bread' },
  { label: 'Pantry',        href: '/products?category=Pantry+%26+Dry+Goods' },
  { label: 'Beverages',     href: '/products?category=Beverages' },
  { label: 'Snacks',        href: '/products?category=Snacks+%26+Confectionery' },
  { label: 'Meat & Fish',   href: '/products?category=Meat+%26+Seafood' },
];

export default function Header() {
  const { count, setIsOpen } = useCart();
  const { count: wCount } = useWishlist();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ]                   = useState('');
  const router = useRouter();
  const inputRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [searchOpen]);

  const search = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/products?search=${encodeURIComponent(q.trim())}`);
    setQ(''); setSearchOpen(false); setMobileOpen(false);
  };

  const close = () => { setMobileOpen(false); setSearchOpen(false); };

  return (
    <>
      {/* Announcement bar */}
      <div style={{ background: 'var(--near-black)', height: 36, overflow: 'hidden' }}>
        <div className="marquee-wrap" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <div className="marquee-track" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.6875rem', letterSpacing: '0.08em' }}>
            {Array(6).fill(['🌿 Certified Organic', '🚚 Free Delivery £50+', '⚡ Same-Day by 2pm', '🌍 Plastic-Free Packaging', '⭐ 50,000+ Happy Customers', '♻️ Carbon Neutral Delivery']).flat().map((t, i) => (
              <span key={i} style={{ marginRight: '4rem' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="container">
          <div style={{ height: 60, display: 'flex', alignItems: 'center', gap: '1rem' }}>

            {/* Hamburger - mobile */}
            <button className="show-mobile btn btn-ghost btn-icon"
              onClick={() => setMobileOpen(true)} aria-label="Menu"
              style={{ color: 'var(--ink)', border: '1px solid var(--hairline)', background: '#fff' }}>
              <Menu size={18} />
            </button>

            {/* Logo */}
            <Link href="/" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, var(--green), #27ae60)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(26,122,74,0.35)' }}>
                <Leaf size={14} color="#fff" />
              </div>
              <span style={{ fontSize: '1.0625rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--ink)' }}>FRESHMART</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hide-mobile" style={{ display: 'flex', gap: '0.125rem', flex: 1, justifyContent: 'center' }}>
              {NAV.map(n => (
                <Link key={n.href} href={n.href}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.8125rem', color: 'var(--slate)', padding: '0.4rem 0.7rem' }}>
                  {n.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginLeft: 'auto' }}>
              <button className="btn btn-ghost btn-icon" onClick={() => setSearchOpen(true)}
                style={{ border: '1px solid var(--hairline)', color: 'var(--ink)' }}>
                <Search size={17} />
              </button>

              <Link href="/wishlist" className="btn btn-ghost btn-icon"
                style={{ border: '1px solid var(--hairline)', color: 'var(--ink)', position: 'relative', display: 'flex' }}>
                <Heart size={17} />
                {wCount > 0 && (
                  <span style={{ position: 'absolute', top: -5, right: -5, width: 17, height: 17, borderRadius: '50%', background: 'var(--violet)', color: '#fff', fontSize: '0.5625rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {wCount}
                  </span>
                )}
              </Link>

              <button onClick={() => setIsOpen(true)}
                className="hide-mobile btn btn-primary btn-sm"
                style={{ gap: 6, position: 'relative' }}>
                <ShoppingBag size={15} /> Cart
                {count > 0 && (
                  <span style={{ background: 'var(--violet)', borderRadius: 99, padding: '0 6px', fontSize: '0.6875rem', fontWeight: 800 }}>{count}</span>
                )}
              </button>

              <button onClick={() => setIsOpen(true)}
                className="show-mobile btn btn-ghost btn-icon"
                style={{ border: '1px solid var(--hairline)', color: 'var(--ink)', position: 'relative', display: 'flex' }}>
                <ShoppingBag size={17} />
                {count > 0 && (
                  <span style={{ position: 'absolute', top: -5, right: -5, width: 17, height: 17, borderRadius: '50%', background: 'var(--ink)', color: '#fff', fontSize: '0.5625rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        {searchOpen && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderBottom: '1px solid var(--hairline)', padding: '1rem 0', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', zIndex: 99 }}>
            <div className="container">
              <form onSubmit={search} style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                <Search size={18} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                <input ref={inputRef} type="text" value={q} onChange={e => setQ(e.target.value)}
                  placeholder="Search products, categories..."
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', fontFamily: 'inherit', color: 'var(--ink)', background: 'transparent' }} />
                <button type="button" className="btn btn-ghost" style={{ fontSize: '0.8125rem' }} onClick={() => setSearchOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Search</button>
              </form>
            </div>
          </div>
        )}
        {searchOpen && <div style={{ position: 'fixed', inset: 0, top: 96, zIndex: 98 }} onClick={() => setSearchOpen(false)} />}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-menu">
            <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid var(--hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link href="/" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, var(--green), #27ae60)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Leaf size={13} color="#fff" />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.04em' }}>FRESHMART</span>
              </Link>
              <button className="btn btn-ghost btn-icon" onClick={() => setMobileOpen(false)}
                style={{ border: '1px solid var(--hairline)' }}>
                <X size={17} />
              </button>
            </div>

            <div style={{ padding: '0.75rem 1rem' }}>
              <form onSubmit={search} style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Search..."
                  className="input" style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }} />
              </form>
            </div>

            <nav>
              {NAV.map((n, i) => (
                <Link key={n.href} href={n.href} onClick={close}
                  className="afu"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9375rem 1.25rem', borderBottom: '1px solid var(--hairline)', color: 'var(--ink)', fontWeight: 500, fontSize: '0.9375rem', animationDelay: `${i * 0.04}s` }}>
                  {n.label} <ArrowRight size={15} style={{ color: 'var(--muted)' }} />
                </Link>
              ))}
            </nav>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: 'auto' }}>
              <Link href="/wishlist" onClick={close} className="btn btn-outline" style={{ justifyContent: 'center' }}>
                <Heart size={15} /> Wishlist {wCount > 0 && `(${wCount})`}
              </Link>
              <button onClick={() => { setIsOpen(true); close(); }} className="btn btn-primary" style={{ justifyContent: 'center' }}>
                <ShoppingBag size={15} /> Cart {count > 0 && `(${count})`}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
