'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShoppingBag, Heart, Search, Menu, X, Leaf, ArrowRight, ChevronDown } from 'lucide-react';

const NAV = [
  { label: 'Fresh Produce', href: '/products?category=Fruits+%26+Vegetables' },
  { label: 'Dairy & Eggs', href: '/products?category=Dairy+%26+Eggs' },
  { label: 'Bakery', href: '/products?category=Bakery+%26+Bread' },
  { label: 'Pantry', href: '/products?category=Pantry+%26+Dry+Goods' },
  { label: 'Beverages', href: '/products?category=Beverages' },
  { label: 'Snacks', href: '/products?category=Snacks+%26+Confectionery' },
  { label: 'Meat & Fish', href: '/products?category=Meat+%26+Seafood' },
];

export default function Header() {
  const { count, setIsOpen } = useCart();
  const { count: wCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery('');
    setMobileOpen(false);
  };

  const closeAll = () => { setMobileOpen(false); setSearchOpen(false); };

  return (
    <>
      {/* Promo ticker */}
      <div style={{ background: 'var(--near-black)', color: '#fff', height: 36 }} className="flex items-center overflow-hidden">
        <div className="ticker-wrap w-full">
          <div className="ticker-inner anim-ticker text-11" style={{ color: 'var(--concrete)' }}>
            {Array(3).fill([
              '🌿 Certified Organic Produce',
              '🚚 Free Delivery on Orders £50+',
              '⚡ Same-Day Delivery Before 2pm',
              '🌍 100% Plastic-Free Packaging',
              '⭐ Over 50,000 Happy Customers',
              '🔄 Free Returns Within 24 Hours',
            ]).flat().map((t, i) => (
              <span key={i} className="inline-block mx-8">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`header-sticky${scrolled ? ' scrolled' : ''}`}>
        <div className="page-container">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/" onClick={closeAll} className="flex items-center gap-2 shrink-0 mr-2">
              <div style={{ background: 'var(--accent-green)', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Leaf size={14} color="#fff" />
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--ink)' }}>
                FRESHMART
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hide-mobile flex items-center gap-1 flex-1">
              {NAV.map(n => (
                <Link key={n.href} href={n.href}
                  className="btn-ghost text-12"
                  style={{ color: 'var(--slate)', padding: '6px 10px' }}>
                  {n.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Search */}
              <button onClick={() => setSearchOpen(true)}
                style={{ width: 40, height: 40, borderRadius: 'var(--radius-pill)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', cursor: 'pointer', transition: 'all 0.15s', color: 'var(--ink)' }}
                className="hover:border-[var(--ink)]"
                aria-label="Search">
                <Search size={17} />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist"
                style={{ width: 40, height: 40, borderRadius: 'var(--radius-pill)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', position: 'relative', color: 'var(--ink)' }}
                aria-label="Wishlist">
                <Heart size={17} />
                {wCount > 0 && (
                  <span style={{ position: 'absolute', top: -4, right: -4, width: 17, height: 17, background: 'var(--violet)', color: '#fff', borderRadius: '50%', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {wCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button onClick={() => setIsOpen(true)}
                style={{ height: 40, borderRadius: 'var(--radius-pill)', padding: '0 16px', background: 'var(--ink)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, letterSpacing: '-0.02em', position: 'relative', transition: 'all 0.15s' }}
                className="hide-mobile"
                aria-label="Cart">
                <ShoppingBag size={16} />
                Cart
                {count > 0 && (
                  <span style={{ background: 'var(--violet)', borderRadius: 99, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>{count}</span>
                )}
              </button>

              {/* Mobile cart icon */}
              <button onClick={() => setIsOpen(true)}
                style={{ width: 40, height: 40, borderRadius: 'var(--radius-pill)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', position: 'relative', cursor: 'pointer', color: 'var(--ink)' }}
                className="show-mobile"
                aria-label="Cart">
                <ShoppingBag size={17} />
                {count > 0 && (
                  <span style={{ position: 'absolute', top: -4, right: -4, width: 17, height: 17, background: 'var(--violet)', color: '#fff', borderRadius: '50%', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>
                )}
              </button>

              {/* Hamburger */}
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="show-mobile"
                style={{ width: 40, height: 40, borderRadius: 'var(--radius-pill)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', cursor: 'pointer', color: 'var(--ink)' }}
                aria-label="Menu">
                <div style={{ position: 'relative', width: 18, height: 14 }}>
                  <span style={{ position: 'absolute', left: 0, width: '100%', height: 2, background: 'var(--ink)', borderRadius: 2, transition: 'all 0.25s cubic-bezier(0.25,0.46,0.45,0.94)', top: mobileOpen ? '50%' : 0, transform: mobileOpen ? 'translateY(-50%) rotate(45deg)' : 'none' }} />
                  <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '100%', height: 2, background: 'var(--ink)', borderRadius: 2, transition: 'all 0.25s', opacity: mobileOpen ? 0 : 1 }} />
                  <span style={{ position: 'absolute', left: 0, width: '100%', height: 2, background: 'var(--ink)', borderRadius: 2, transition: 'all 0.25s cubic-bezier(0.25,0.46,0.45,0.94)', bottom: mobileOpen ? '50%' : 0, transform: mobileOpen ? 'translateY(50%) rotate(-45deg)' : 'none' }} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <>
          <div className="search-overlay" onClick={() => setSearchOpen(false)} />
          <div className="search-box">
            <form onSubmit={handleSearch} style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
              <input ref={searchRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search products, categories..."
                className="input-pill" style={{ paddingRight: 120 }} />
              <div style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 6 }}>
                <button type="button" onClick={() => setSearchOpen(false)} className="btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }}>Cancel</button>
                <button type="submit" className="btn-violet" style={{ padding: '10px 16px', fontSize: 13 }}>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu" style={{ paddingTop: 20 }}>
          <div style={{ padding: '0 20px 20px', borderBottom: '1px solid var(--hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Link href="/" onClick={closeAll} className="flex items-center gap-2">
              <div style={{ background: 'var(--accent-green)', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Leaf size={14} color="#fff" />
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.04em' }}>FRESHMART</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} style={{ width: 36, height: 36, borderRadius: 99, border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fff' }}>
              <X size={16} />
            </button>
          </div>

          {/* Mobile search */}
          <div style={{ padding: '16px 20px' }}>
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate)' }} />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                className="input-field"
                style={{ paddingLeft: 40, borderRadius: 'var(--radius-pill)' }} />
            </form>
          </div>

          {/* Nav links */}
          <nav>
            {NAV.map((n, i) => (
              <Link key={n.href} href={n.href} onClick={closeAll}
                className="anim-fade-up"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', fontSize: 16, letterSpacing: '-0.02em', borderBottom: '1px solid var(--hairline)', color: 'var(--ink)', textDecoration: 'none', animationDelay: `${i * 0.04}s` }}>
                {n.label}
                <ArrowRight size={16} style={{ color: 'var(--slate)' }} />
              </Link>
            ))}
          </nav>

          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href="/wishlist" onClick={closeAll} className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              <Heart size={16} /> Wishlist {wCount > 0 && `(${wCount})`}
            </Link>
            <button onClick={() => { setIsOpen(true); closeAll(); }} className="btn-violet" style={{ width: '100%' }}>
              <ShoppingBag size={16} /> Cart {count > 0 && `(${count})`}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
