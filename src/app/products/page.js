'use client';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';

const CATEGORIES = ['All', 'Fruits & Vegetables', 'Dairy & Eggs', 'Bakery & Bread', 'Pantry & Dry Goods', 'Meat & Seafood', 'Beverages', 'Snacks & Confectionery'];
const SORTS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Biggest Discount' },
];

function SkeletonCard() {
  return (
    <div style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
      <div className="skeleton" style={{ aspectRatio: '1/1' }} />
      <div style={{ padding: 12 }}>
        <div className="skeleton" style={{ height: 10, width: '40%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 6 }} />
        <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 20, width: '35%' }} />
      </div>
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('default');
  const [searchQ, setSearchQ] = useState(searchParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(25);
  const [filters, setFilters] = useState({
    organic: searchParams.get('organic') === 'true',
    flashSale: searchParams.get('flashSale') === 'true',
    newArrival: searchParams.get('newArrival') === 'true',
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (category !== 'All') p.set('category', category);
      p.set('sort', sort);
      if (searchQ) p.set('search', searchQ);
      if (filters.organic) p.set('organic', 'true');
      if (filters.flashSale) p.set('flashSale', 'true');
      if (filters.newArrival) p.set('newArrival', 'true');
      p.set('maxPrice', maxPrice);
      const res = await fetch(`/api/products?${p}`);
      const data = await res.json();
      setProducts((data.products || []).map(p => ({ ...p, id: (p.id || p._id)?.toString() })));
    } catch { setProducts([]); }
    setLoading(false);
  }, [category, sort, searchQ, filters, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Sync URL params
  useEffect(() => {
    const c = searchParams.get('category');
    const s = searchParams.get('search');
    if (c) setCategory(c);
    if (s) setSearchQ(s);
    setFilters({
      organic: searchParams.get('organic') === 'true',
      flashSale: searchParams.get('flashSale') === 'true',
      newArrival: searchParams.get('newArrival') === 'true',
    });
  }, [searchParams]);

  const clearAll = () => {
    setCategory('All'); setSearchQ(''); setFilters({ organic: false, flashSale: false, newArrival: false }); setMaxPrice(25);
  };

  const activeCount = Object.values(filters).filter(Boolean).length + (category !== 'All' ? 1 : 0) + (searchQ ? 1 : 0);

  return (
    <div style={{ minHeight: '70vh' }}>
      {/* Page header */}
      <div style={{ background: 'var(--canvas)', borderBottom: '1px solid var(--hairline)', padding: '32px 0 0' }}>
        <div className="page-container">
          <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: 6 }}>Our Range</p>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 20 }}>
            {searchQ ? `Results for "${searchQ}"` : 'All Products'}
          </h1>
          {/* Category chips */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 16, scrollbarWidth: 'none' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`filter-chip${category === c ? ' active' : ''}`}
                style={{ flexShrink: 0 }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="page-container" style={{ padding: '24px 24px' }}>
        <div style={{ display: 'flex', gap: 28 }}>
          {/* Sidebar */}
          <aside style={{ width: 220, flexShrink: 0 }} className="hide-mobile">
            <FilterSidebar filters={filters} setFilters={setFilters} maxPrice={maxPrice} setMaxPrice={setMaxPrice} clearAll={clearAll} activeCount={activeCount} />
          </aside>

          {/* Mobile filter drawer */}
          {sidebarOpen && (
            <>
              <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
              <div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 280, background: '#fff', zIndex: 201, overflowY: 'auto', padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <span style={{ fontWeight: 600, fontSize: 16 }}>Filters</span>
                  <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <FilterSidebar filters={filters} setFilters={setFilters} maxPrice={maxPrice} setMaxPrice={setMaxPrice} clearAll={clearAll} activeCount={activeCount} onClose={() => setSidebarOpen(false)} />
              </div>
            </>
          )}

          {/* Main */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => setSidebarOpen(true)} className="show-mobile btn-ghost"
                  style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--radius-pill)', padding: '8px 14px', fontSize: 13 }}>
                  <SlidersHorizontal size={14} /> Filters {activeCount > 0 && `(${activeCount})`}
                </button>
                <p style={{ fontSize: 13, color: 'var(--slate)' }}>
                  {loading ? 'Loading...' : `${products.length} products`}
                </p>
                {activeCount > 0 && (
                  <button onClick={clearAll} style={{ fontSize: 12, color: 'var(--violet)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    Clear all
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <select value={sort} onChange={e => setSort(e.target.value)}
                  style={{ appearance: 'none', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-pill)', background: '#fff', padding: '8px 36px 8px 14px', fontSize: 13, letterSpacing: '-0.02em', outline: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)' }}>
                  {SORTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={13} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--slate)' }} />
              </div>
            </div>

            {loading ? (
              <div className="product-grid">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No products found</h3>
                <p style={{ color: 'var(--slate)', marginBottom: 20, fontSize: 14 }}>Try adjusting your filters or search terms.</p>
                <button onClick={clearAll} className="btn-violet" style={{ fontSize: 13 }}>Clear All Filters</button>
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

function FilterSidebar({ filters, setFilters, maxPrice, setMaxPrice, clearAll, activeCount, onClose }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 12, fontWeight: 600 }}>Price Range</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
          <span>£0</span><span style={{ fontWeight: 600 }}>£{maxPrice}</span>
        </div>
        <input type="range" min={1} max={25} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
          style={{ width: '100%', accentColor: 'var(--violet)' }} />
      </div>
      <div>
        <p style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 12, fontWeight: 600 }}>Filter By</p>
        {[['organic', '🌿 Organic Only'], ['flashSale', '⚡ On Sale'], ['newArrival', '✨ New Arrivals']].map(([k, label]) => (
          <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
            <div onClick={() => setFilters(f => ({ ...f, [k]: !f[k] }))}
              style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${filters[k] ? 'var(--violet)' : 'var(--hairline)'}`, background: filters[k] ? 'var(--violet)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', cursor: 'pointer', flexShrink: 0 }}>
              {filters[k] && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
            </div>
            <span style={{ fontSize: 13, color: 'var(--ink)', letterSpacing: '-0.02em' }}>{label}</span>
          </label>
        ))}
      </div>
      {activeCount > 0 && (
        <button onClick={() => { clearAll(); onClose?.(); }}
          style={{ fontSize: 12, color: '#ef4444', background: 'none', border: '1px solid #fee2e2', borderRadius: 'var(--radius-pill)', padding: '7px 14px', cursor: 'pointer', transition: 'all 0.15s' }}>
          Clear All Filters
        </button>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="page-container" style={{ padding: '48px 24px' }}><div className="product-grid">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" style={{ aspectRatio: '1/1.4', borderRadius: 'var(--radius-sm)' }} />)}</div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
