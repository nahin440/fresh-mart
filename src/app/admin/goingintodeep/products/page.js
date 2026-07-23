'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, Search, Eye } from 'lucide-react';
import productsData from '@/lib/products.json';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetch('/api/products').then(r=>r.json())
      .then(d=>{setProducts((d.products||[]).map(p=>({...p,id:(p.id||p._id)?.toString()})));setLoading(false);})
      .catch(()=>{setProducts(productsData);setLoading(false);});
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const del = async (id) => {
    if (!confirm('Delete this product?')) return;
    setDeleting(id);
    try {
      const r = await fetch(`/api/products/${id}`,{method:'DELETE'});
      if (r.ok) setProducts(ps=>ps.filter(p=>p.id!==id));
      else alert('Delete failed — MongoDB may not be connected.');
    } catch { alert('Could not delete.'); }
    setDeleting(null);
  };

  return (
    <div style={{ padding:'clamp(1.5rem,4vw,2.5rem)' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.75rem',flexWrap:'wrap',gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'clamp(1.5rem,3vw,2rem)',fontWeight:800,letterSpacing:'-0.03em',marginBottom:'0.25rem' }}>Products</h1>
          <p style={{ color:'var(--slate)',fontSize:'0.9375rem' }}>{products.length} total products</p>
        </div>
        <Link href="/admin/goingintodeep/add-product" className="btn btn-violet">
          <Plus size={16}/> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="admin-card" style={{ padding:'0.875rem 1rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.75rem' }}>
        <Search size={16} style={{color:'var(--muted)',flexShrink:0}}/>
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."
          style={{ flex:1,border:'none',outline:'none',fontSize:'0.9375rem',fontFamily:'inherit',color:'var(--ink)',background:'transparent' }}/>
        {search&&<button onClick={()=>setSearch('')} style={{fontSize:'0.8125rem',color:'var(--slate)',background:'none',border:'none',cursor:'pointer'}}>Clear</button>}
      </div>

      {/* Table */}
      <div className="admin-card" style={{ overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table className="data-table" style={{ minWidth:680 }}>
            <thead>
              <tr>{['Product','Category','Price','Stock','Labels','Actions'].map(h=><th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_,i)=>(
                  <tr key={i}>{[...Array(6)].map((_,j)=><td key={j}><div className="skeleton" style={{height:14,borderRadius:4}}/></td>)}</tr>
                ))
              ) : filtered.length===0 ? (
                <tr><td colSpan={6} style={{textAlign:'center',padding:'3rem',color:'var(--slate)'}}>No products found</td></tr>
              ) : (
                filtered.map(p=>(
                  <tr key={p.id}>
                    <td>
                      <div style={{ display:'flex',alignItems:'center',gap:'0.75rem' }}>
                        <div style={{ width:42,height:42,borderRadius:10,overflow:'hidden',background:'var(--canvas)',flexShrink:0 }}>
                          <img src={p.image} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} loading="lazy"/>
                        </div>
                        <div style={{ minWidth:0 }}>
                          <p style={{ fontWeight:600,fontSize:'0.9375rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:200 }}>{p.name}</p>
                          <p style={{ fontSize:'0.75rem',color:'var(--slate)' }}>{p.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ color:'var(--slate)',fontSize:'0.875rem' }}>{p.category}</td>
                    <td>
                      <p style={{ fontWeight:800,fontSize:'1rem' }}>৳{p.price.toFixed(2)}</p>
                      {p.originalPrice&&<p style={{ fontSize:'0.75rem',color:'var(--muted)',textDecoration:'line-through' }}>৳{p.originalPrice.toFixed(2)}</p>}
                    </td>
                    <td>
                      <span style={{ fontWeight:700,fontSize:'0.9375rem',color:p.stock<10?'#e74c3c':p.stock<20?'#f59e0b':'var(--green)' }}>{p.stock}</span>
                    </td>
                    <td>
                      <div style={{ display:'flex',gap:'0.25rem',flexWrap:'wrap' }}>
                        {p.isFlashSale   &&<span className="tag tag-red"   style={{fontSize:'0.625rem'}}>SALE</span>}
                        {p.isNewArrival  &&<span className="tag tag-violet" style={{fontSize:'0.625rem'}}>NEW</span>}
                        {p.isBestSeller  &&<span className="tag tag-dark"   style={{fontSize:'0.625rem'}}>BEST</span>}
                        {p.isOrganic     &&<span className="tag tag-green"  style={{fontSize:'0.625rem'}}>ORG</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display:'flex',gap:'0.375rem' }}>
                        {[{ href:`/products/${p.id}`, icon:Eye, title:'View', c:'var(--slate)' },
                          { href:`/admin/goingintodeep/edit-product/${p.id}`, icon:Edit, title:'Edit', c:'var(--violet)' }].map(({ href, icon:Icon, title, c })=>(
                          <Link key={href} href={href} title={title}
                            style={{ width:32,height:32,borderRadius:8,border:'1px solid var(--hairline)',display:'flex',alignItems:'center',justifyContent:'center',color:c,textDecoration:'none',transition:'all 0.15s',background:'#fff' }}
                            onMouseEnter={e=>{e.currentTarget.style.background=c==='var(--violet)'?'var(--violet)':'var(--canvas)';e.currentTarget.style.color=c==='var(--violet)'?'#fff':c;}}
                            onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color=c;}}>
                            <Icon size={14}/>
                          </Link>
                        ))}
                        <button onClick={()=>del(p.id)} disabled={deleting===p.id} title="Delete"
                          style={{ width:32,height:32,borderRadius:8,border:'1px solid var(--hairline)',display:'flex',alignItems:'center',justifyContent:'center',color:'#e74c3c',cursor:'pointer',transition:'all 0.15s',background:'#fff',opacity:deleting===p.id?0.5:1 }}
                          onMouseEnter={e=>{e.currentTarget.style.background='#fee2e2';}}
                          onMouseLeave={e=>{e.currentTarget.style.background='#fff';}}>
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
