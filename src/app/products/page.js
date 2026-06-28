'use client';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const CATS = ['All','Fruits & Vegetables','Dairy & Eggs','Bakery & Bread','Pantry & Dry Goods','Meat & Seafood','Beverages','Snacks & Confectionery'];
const SORTS = [{value:'default',label:'Featured'},{value:'price-asc',label:'Price: Low → High'},{value:'price-desc',label:'Price: High → Low'},{value:'rating',label:'Top Rated'},{value:'discount',label:'Biggest Discount'}];

function Skel() {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--hairline)' }}>
      <div className="skeleton" style={{ aspectRatio: '1/1' }} />
      <div style={{ padding: '0.875rem' }}>
        {[40,75,55,30].map((w,i)=><div key={i} className="skeleton" style={{height:i===1?16:12,width:`${w}%`,marginBottom:'0.5rem',borderRadius:6}}/>)}
      </div>
    </div>
  );
}

function Filters({ filters, setFilters, maxPrice, setMaxPrice, clearAll, count, onClose }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.75rem' }}>Max Price</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
          <span>£0</span><span style={{ fontWeight: 700 }}>£{maxPrice}</span>
        </div>
        <input type="range" min={1} max={25} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} style={{ width: '100%', accentColor: 'var(--violet)' }} />
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.75rem' }}>Filter By</p>
        {[['organic','🌿 Organic Only'],['flashSale','⚡ On Sale'],['newArrival','✨ New Arrivals']].map(([k,label])=>(
          <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem', cursor: 'pointer' }}>
            <div onClick={() => setFilters(f=>({...f,[k]:!f[k]}))}
              style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${filters[k]?'var(--violet)':'var(--hairline)'}`, background: filters[k]?'var(--violet)':'#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', cursor: 'pointer', flexShrink: 0 }}>
              {filters[k] && <span style={{ color:'#fff',fontSize:'0.75rem',fontWeight:800,lineHeight:1 }}>✓</span>}
            </div>
            <span style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>{label}</span>
          </label>
        ))}
      </div>
      {count > 0 && (
        <button onClick={()=>{clearAll();onClose?.();}}
          style={{ fontSize:'0.8125rem',color:'#e74c3c',background:'#fee',border:'1.5px solid #fcc',borderRadius:100,padding:'0.5rem 1rem',cursor:'pointer',fontFamily:'inherit',transition:'all 0.15s' }}>
          Clear All Filters
        </button>
      )}
    </div>
  );
}

function ProductsContent() {
  const sp = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [category, setCat]      = useState(sp.get('category') || 'All');
  const [sort, setSort]         = useState('default');
  const [search, setSearch]     = useState(sp.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(25);
  const [filters, setFilters]   = useState({ organic: sp.get('organic')==='true', flashSale: sp.get('flashSale')==='true', newArrival: sp.get('newArrival')==='true' });
  const [sidebar, setSidebar]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (category !== 'All') p.set('category', category);
      p.set('sort', sort); p.set('maxPrice', maxPrice);
      if (search) p.set('search', search);
      if (filters.organic)   p.set('organic',   'true');
      if (filters.flashSale) p.set('flashSale', 'true');
      if (filters.newArrival)p.set('newArrival','true');
      const r = await fetch(`/api/products?${p}`);
      const d = await r.json();
      setProducts((d.products||[]).map(p=>({...p,id:(p.id||p._id)?.toString()})));
    } catch { setProducts([]); }
    setLoading(false);
  }, [category, sort, search, filters, maxPrice]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const c=sp.get('category'), s=sp.get('search');
    if(c) setCat(c); if(s) setSearch(s);
    setFilters({ organic:sp.get('organic')==='true', flashSale:sp.get('flashSale')==='true', newArrival:sp.get('newArrival')==='true' });
  }, [sp]);

  const clearAll = () => { setCat('All'); setSearch(''); setFilters({organic:false,flashSale:false,newArrival:false}); setMaxPrice(25); };
  const activeCount = Object.values(filters).filter(Boolean).length + (category!=='All'?1:0) + (search?1:0);

  return (
    <div style={{ minHeight: '70vh', background: 'var(--off-white)' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--hairline)', padding: 'clamp(1.5rem,4vw,2.5rem) 0 0' }}>
        <div className="container">
          <span className="eyebrow">Our Range</span>
          <h1 className="t-h1" style={{ marginBottom: '1.25rem' }}>
            {search ? `Results for "${search}"` : 'All Products'}
          </h1>
          {/* Cat chips */}
          <div style={{ display: 'flex', gap: '0.375rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} className={`chip${category===c?' active':''}`} style={{ flexShrink: 0 }}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'clamp(1.5rem,4vw,2.5rem) 0' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Sidebar — desktop */}
          <aside style={{ width: 220, flexShrink: 0, background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--hairline)', position: 'sticky', top: 80 }} className="hide-mobile">
            <p style={{ fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>Filters</p>
            <Filters filters={filters} setFilters={setFilters} maxPrice={maxPrice} setMaxPrice={setMaxPrice} clearAll={clearAll} count={activeCount} />
          </aside>

          {/* Mobile sidebar drawer */}
          {sidebar && (
            <>
              <div onClick={() => setSidebar(false)} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:200 }} />
              <div style={{ position:'fixed',top:0,left:0,bottom:0,width:280,background:'#fff',zIndex:201,overflowY:'auto',padding:'1.5rem' }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem' }}>
                  <span style={{ fontWeight:700,fontSize:'1rem' }}>Filters</span>
                  <button className="btn btn-ghost btn-icon" onClick={() => setSidebar(false)} style={{ border:'1px solid var(--hairline)' }}><X size={17}/></button>
                </div>
                <Filters filters={filters} setFilters={setFilters} maxPrice={maxPrice} setMaxPrice={setMaxPrice} clearAll={clearAll} count={activeCount} onClose={() => setSidebar(false)} />
              </div>
            </>
          )}

          {/* Main */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Toolbar */}
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.25rem',gap:'0.75rem',flexWrap:'wrap' }}>
              <div style={{ display:'flex',alignItems:'center',gap:'0.625rem' }}>
                <button onClick={() => setSidebar(true)} className="show-mobile btn btn-outline btn-sm" style={{ display:'flex',alignItems:'center',gap:6 }}>
                  <SlidersHorizontal size={14}/> Filters {activeCount>0&&`(${activeCount})`}
                </button>
                <span style={{ fontSize:'0.875rem',color:'var(--slate)' }}>{loading?'Loading…':`${products.length} products`}</span>
                {activeCount>0 && <button onClick={clearAll} style={{ fontSize:'0.8125rem',color:'var(--violet)',background:'none',border:'none',cursor:'pointer',textDecoration:'underline',fontFamily:'inherit' }}>Clear</button>}
              </div>
              <div style={{ position:'relative' }}>
                <select value={sort} onChange={e=>setSort(e.target.value)}
                  style={{ appearance:'none',border:'1.5px solid var(--hairline)',borderRadius:100,background:'#fff',padding:'0.5rem 2.5rem 0.5rem 1rem',fontSize:'0.875rem',outline:'none',cursor:'pointer',fontFamily:'inherit',color:'var(--ink)' }}>
                  {SORTS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={13} style={{ position:'absolute',right:'0.875rem',top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'var(--slate)' }} />
              </div>
            </div>

            {loading ? (
              <div className="product-grid">{Array.from({length:8}).map((_,i)=><Skel key={i}/>)}</div>
            ) : products.length===0 ? (
              <div style={{ textAlign:'center',padding:'5rem 1rem' }}>
                <div style={{ fontSize:'3.5rem',marginBottom:'1rem' }}>🔍</div>
                <h3 className="t-h3" style={{ marginBottom:'0.625rem' }}>No products found</h3>
                <p className="t-body" style={{ marginBottom:'1.5rem' }}>Try adjusting your filters or search terms.</p>
                <button onClick={clearAll} className="btn btn-primary">Clear All Filters</button>
              </div>
            ) : (
              <div className="product-grid">
                {products.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}
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
    <Suspense fallback={<div className="container" style={{padding:'2rem 0'}}><div className="product-grid">{Array.from({length:8}).map((_,i)=><Skel key={i}/>)}</div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
