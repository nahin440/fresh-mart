'use client';
import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { SlidersHorizontal, X, ChevronDown, Search, ListTree, Tags, Check } from 'lucide-react';

const SORTS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Biggest Discount' },
];

const QUICK_FILTERS = [
  { key: 'organic', label: 'Organic Only' },
  { key: 'flashSale', label: 'On Sale' },
  { key: 'newArrival', label: 'New Arrivals' },
];

function Skel() {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--hairline)' }}>
      <div className="skeleton" style={{ aspectRatio: '1/1' }} />
      <div style={{ padding: '0.875rem' }}>
        {[40, 75, 55, 30].map((w, i) => <div key={i} className="skeleton" style={{ height: i === 1 ? 16 : 12, width: `${w}%`, marginBottom: '0.5rem', borderRadius: 6 }} />)}
      </div>
    </div>
  );
}

// Combined Sort + Filter dropdown, anchored beside the search bar. Click
// outside or Escape closes it — a plain <select> can't hold both a sort
// list AND a set of independent filter checkboxes, so this is a custom
// popover instead.
function SortFilterMenu({ sort, setSort, filters, setFilters, maxPrice, setMaxPrice, activeCount, clearAll }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} className="btn btn-outline btn-sm"
        style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
        <SlidersHorizontal size={14} /> Sort & Filter {activeCount > 0 && `(${activeCount})`}
        <ChevronDown size={13} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0, zIndex: 120,
          width: 'min(320px, 88vw)', background: '#fff', borderRadius: 16,
          border: '1px solid var(--hairline)', boxShadow: '0 12px 40px rgba(0,0,0,0.14)',
          padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem',
        }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.625rem' }}>Sort By</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {SORTS.map(o => (
                <button key={o.value} onClick={() => setSort(o.value)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', padding: '0.5rem 0.625rem', borderRadius: 9, border: 'none', background: sort === o.value ? 'var(--violet-pale)' : 'transparent', color: sort === o.value ? 'var(--violet)' : 'var(--ink)', fontWeight: sort === o.value ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                  {o.label} {sort === o.value && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.625rem' }}>Max Price</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span>£0</span><span style={{ fontWeight: 700 }}>£{maxPrice}</span>
            </div>
            <input type="range" min={1} max={25} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} style={{ width: '100%', accentColor: 'var(--violet)' }} />
          </div>

          <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.625rem' }}>Filter By</p>
            {QUICK_FILTERS.map(({ key, label }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                <div onClick={() => setFilters(f => ({ ...f, [key]: !f[key] }))}
                  style={{ width: 19, height: 19, borderRadius: 6, border: `2px solid ${filters[key] ? 'var(--violet)' : 'var(--hairline)'}`, background: filters[key] ? 'var(--violet)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0 }}>
                  {filters[key] && <Check size={12} color="#fff" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>{label}</span>
              </label>
            ))}
          </div>

          {activeCount > 0 && (
            <button onClick={() => { clearAll(); setOpen(false); }}
              style={{ fontSize: '0.8125rem', color: '#e74c3c', background: '#fee', border: '1.5px solid #fcc', borderRadius: 100, padding: '0.5rem 1rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Category + Type list for the sidebar. Shared between the desktop
// persistent column and the mobile drawer so the two never drift apart.
function SidebarNav({ categories, types, category, setCat, onNavigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.02em', marginBottom: '0.875rem' }}>
          <ListTree size={16} /> Categories
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          <button onClick={() => { setCat('All'); onNavigate?.(); }}
            style={{ textAlign: 'left', padding: '0.5rem 0.625rem', borderRadius: 9, border: 'none', background: category === 'All' ? 'var(--canvas)' : 'transparent', color: category === 'All' ? 'var(--ink)' : 'var(--slate)', fontWeight: category === 'All' ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            All Categories
          </button>
          {categories.map(c => (
            <button key={c.slug || c._id} onClick={() => { setCat(c.name); onNavigate?.(); }}
              style={{ textAlign: 'left', padding: '0.5rem 0.625rem', borderRadius: 9, border: 'none', background: category === c.name ? 'var(--canvas)' : 'transparent', color: category === c.name ? 'var(--ink)' : 'var(--slate)', fontWeight: category === c.name ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {types.length > 0 && (
        <div>
          <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.02em', marginBottom: '0.875rem' }}>
            <Tags size={16} /> Types
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {types.map(t => (
              <Link key={t.slug || t._id} href={`/products?type=${t.slug}`} onClick={() => onNavigate?.()} className="chip">
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductsContent() {
  const sp = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCat] = useState(sp.get('category') || 'All');
  const [type, setType] = useState(sp.get('type') || '');
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState(sp.get('search') || '');
  const [searchInput, setSearchInput] = useState(sp.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(25);
  const [filters, setFilters] = useState({ organic: sp.get('organic') === 'true', flashSale: sp.get('flashSale') === 'true', newArrival: sp.get('newArrival') === 'true' });
  const [sidebar, setSidebar] = useState(false);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  // Debounce the visible search input into the actual `search` value that
  // drives fetching, so every keystroke doesn't fire its own request.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || [])).catch(() => {});
    fetch('/api/types').then(r => r.json()).then(d => setTypes(d.types || [])).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      p.set('active', 'true');
      if (category !== 'All') p.set('category', category);
      if (type) p.set('type', type);
      p.set('sort', sort); p.set('maxPrice', maxPrice);
      if (search) p.set('search', search);
      if (filters.organic) p.set('organic', 'true');
      if (filters.flashSale) p.set('flashSale', 'true');
      if (filters.newArrival) p.set('newArrival', 'true');
      const r = await fetch(`/api/products?${p}`);
      const d = await r.json();
      setProducts((d.products || []).map(p => ({ ...p, id: (p.id || p._id)?.toString() })));
      console.log(products)
    } catch { setProducts([]); }
    setLoading(false);
  }, [category, type, sort, search, filters, maxPrice]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const c = sp.get('category'), s = sp.get('search'), t = sp.get('type');
    if (c) setCat(c);
    if (s) { setSearch(s); setSearchInput(s); }
    setType(t || '');
    setFilters({ organic: sp.get('organic') === 'true', flashSale: sp.get('flashSale') === 'true', newArrival: sp.get('newArrival') === 'true' });
  }, [sp]);

  const clearAll = () => { setCat('All'); setType(''); setSearch(''); setSearchInput(''); setFilters({ organic: false, flashSale: false, newArrival: false }); setMaxPrice(25); };
  const activeCount = Object.values(filters).filter(Boolean).length + (category !== 'All' ? 1 : 0) + (type ? 1 : 0);

  const activeTypeLabel = type ? types.find(t => t.slug === type)?.name : null;

  return (
    <div style={{ minHeight: '70vh', background: 'var(--off-white)' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--hairline)', padding: 'clamp(1.5rem,4vw,2.5rem) 0' }}>
        <div className="container">
          <span className="eyebrow">Our Range</span>
          <h1 className="t-h1" style={{ marginBottom: '1.25rem' }}>
            {search ? `Results for "${search}"` : activeTypeLabel ? activeTypeLabel : 'All Products'}
          </h1>

          {/* Search bar + combined sort/filter dropdown, side by side */}
          <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 0 }}>
              <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
                placeholder="Search products…" className="input"
                style={{ paddingLeft: '2.5rem', borderRadius: 100 }}
              />
              {searchInput && (
                <button onClick={() => setSearchInput('')} aria-label="Clear search"
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}>
                  <X size={15} />
                </button>
              )}
            </div>

            <SortFilterMenu sort={sort} setSort={setSort} filters={filters} setFilters={setFilters}
              maxPrice={maxPrice} setMaxPrice={setMaxPrice} activeCount={activeCount} clearAll={clearAll} />

            <button onClick={() => setSidebar(true)} className="show-mobile btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ListTree size={14} /> Categories
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'clamp(1.5rem,4vw,2.5rem) 0' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Sidebar — desktop, persistent */}
          <aside style={{ width: 230, flexShrink: 0, background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--hairline)', position: 'sticky', top: 80 }} className="hide-mobile">
            <SidebarNav categories={categories} types={types} category={category} setCat={setCat} />
          </aside>

          {/* Sidebar — mobile drawer */}
          {sidebar && (
            <>
              <div onClick={() => setSidebar(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200 }} />
              <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 'min(280px, 84vw)', background: '#fff', zIndex: 201, overflowY: 'auto', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>Browse</span>
                  <button className="btn btn-ghost btn-icon" onClick={() => setSidebar(false)} style={{ border: '1px solid var(--hairline)' }}><X size={17} /></button>
                </div>
                <SidebarNav categories={categories} types={types} category={category} setCat={setCat} onNavigate={() => setSidebar(false)} />
              </div>
            </>
          )}

          {/* Main */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--slate)' }}>{loading ? 'Loading…' : `${products.length} products`}</span>
              {activeCount > 0 && <button onClick={clearAll} style={{ fontSize: '0.8125rem', color: 'var(--violet)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Clear filters</button>}
            </div>

            {loading ? (
              <div className="product-grid">{Array.from({ length: 8 }).map((_, i) => <Skel key={i} />)}</div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
                <Search size={40} style={{ color: 'var(--muted)', marginBottom: '1rem' }} />
                <h3 className="t-h3" style={{ marginBottom: '0.625rem' }}>No products found</h3>
                <p className="t-body" style={{ marginBottom: '1.5rem' }}>Try adjusting your filters or search terms.</p>
                <button onClick={clearAll} className="btn btn-primary">Clear All Filters</button>
              </div>
            ) : (
              <div className="product-grid">
                {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '2rem 0' }}><div className="product-grid">{Array.from({ length: 8 }).map((_, i) => <Skel key={i} />)}</div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
