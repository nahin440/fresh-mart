'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, TrendingUp, Star, ArrowUpRight, Plus, Eye } from 'lucide-react';
import productsData from '@/lib/products.json';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders').then(r=>r.json()).then(d=>{setOrders(d.orders||[]);setLoading(false);}).catch(()=>setLoading(false));
  }, []);

  const revenue  = orders.reduce((s,o)=>s+(o.total||0),0);
  const pending  = orders.filter(o=>o.status==='pending').length;
  const lowStock = productsData.filter(p=>p.stock<15).length;
  const avgRat   = (productsData.reduce((s,p)=>s+p.rating,0)/productsData.length).toFixed(1);

  const STATUS_C = { pending:{bg:'#fef3c7',c:'#92400e'}, confirmed:{bg:'#dbeafe',c:'#1e40af'}, preparing:{bg:'#ede9fe',c:'#7c3aed'}, dispatched:{bg:'#d1fae5',c:'#065f46'}, delivered:{bg:'#d1fae5',c:'#059669'}, cancelled:{bg:'#fee2e2',c:'#991b1b'} };

  const STATS = [
    { label:'Total Products', value:productsData.length, icon:Package,      color:'#5433eb', bg:'rgba(84,51,235,0.1)',  sub:`${lowStock} low stock` },
    { label:'Total Orders',   value:orders.length,        icon:ShoppingCart, color:'#3b82f6', bg:'rgba(59,130,246,0.1)', sub:`${pending} pending` },
    { label:'Revenue',        value:`£${revenue.toFixed(2)}`, icon:TrendingUp, color:'#10b981', bg:'rgba(16,185,129,0.1)', sub:'All time' },
    { label:'Avg Rating',     value:avgRat,               icon:Star,         color:'#f59e0b', bg:'rgba(245,158,11,0.1)', sub:'All products' },
  ];

  return (
    <div style={{ padding:'clamp(1.5rem,4vw,2.5rem)' }}>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'clamp(1.5rem,3vw,2rem)',fontWeight:800,letterSpacing:'-0.03em',marginBottom:'0.375rem' }}>Dashboard</h1>
        <p style={{ color:'var(--slate)',fontSize:'0.9375rem' }}>Welcome back — here's your store overview.</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'1rem',marginBottom:'1.5rem' }}>
        {STATS.map(({ label, value, icon:Icon, color, bg, sub })=>(
          <div key={label} className="admin-card" style={{ padding:'1.25rem' }}>
            <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'1rem' }}>
              <div style={{ width:40,height:40,borderRadius:12,background:bg,display:'flex',alignItems:'center',justifyContent:'center' }}>
                <Icon size={18} style={{color}}/>
              </div>
              <ArrowUpRight size={14} style={{color:'var(--muted)'}}/>
            </div>
            <p style={{ fontSize:'clamp(1.5rem,3vw,1.875rem)',fontWeight:900,letterSpacing:'-0.04em',marginBottom:'0.25rem' }}>{value}</p>
            <p style={{ fontSize:'0.875rem',fontWeight:600,color:'var(--ink)',marginBottom:'0.25rem' }}>{label}</p>
            <p style={{ fontSize:'0.8125rem',color:'var(--slate)' }}>{sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,360px),1fr))',gap:'1.25rem',marginBottom:'1.25rem' }}>
        {/* Recent Orders */}
        <div className="admin-card" style={{ padding:'1.5rem' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem' }}>
            <h2 style={{ fontWeight:700,fontSize:'1rem',letterSpacing:'-0.02em' }}>Recent Orders</h2>
            <Link href="/admin/goingintodeep/orders" style={{ fontSize:'0.8125rem',color:'var(--violet)',textDecoration:'none',fontWeight:600 }}>View all →</Link>
          </div>
          {loading ? (
            <div style={{ display:'flex',flexDirection:'column',gap:'0.75rem' }}>
              {[...Array(4)].map((_,i)=><div key={i} className="skeleton" style={{height:52,borderRadius:10}}/>)}
            </div>
          ) : orders.length===0 ? (
            <div style={{ textAlign:'center',padding:'2rem 0',color:'var(--muted)',fontSize:'0.875rem' }}>No orders yet</div>
          ) : (
            <div>
              {orders.slice(0,5).map(o=>{
                const s = STATUS_C[o.status]||STATUS_C.pending;
                return (
                  <div key={o._id||o.orderNumber} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.75rem 0',borderBottom:'1px solid var(--hairline)' }}>
                    <div>
                      <p style={{ fontWeight:700,fontSize:'0.9375rem',marginBottom:'0.125rem' }}>{o.orderNumber}</p>
                      <p style={{ fontSize:'0.8125rem',color:'var(--slate)' }}>{o.customer?.name}</p>
                    </div>
                    <div style={{ display:'flex',alignItems:'center',gap:'0.75rem' }}>
                      <span style={{ fontSize:'0.6875rem',padding:'3px 9px',borderRadius:99,background:s.bg,color:s.c,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.04em' }}>{o.status}</span>
                      <span style={{ fontWeight:800,fontSize:'0.9375rem' }}>£{o.total?.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="admin-card" style={{ padding:'1.5rem' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem' }}>
            <h2 style={{ fontWeight:700,fontSize:'1rem',letterSpacing:'-0.02em' }}>Top Products</h2>
            <Link href="/admin/goingintodeep/products" style={{ fontSize:'0.8125rem',color:'var(--violet)',textDecoration:'none',fontWeight:600 }}>Manage →</Link>
          </div>
          <div>
            {[...productsData].sort((a,b)=>b.reviews-a.reviews).slice(0,5).map((p,i)=>(
              <div key={p.id} style={{ display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.75rem 0',borderBottom:'1px solid var(--hairline)' }}>
                <span style={{ fontSize:'0.75rem',color:'var(--muted)',width:16,textAlign:'center',flexShrink:0 }}>{i+1}</span>
                <div style={{ width:38,height:38,borderRadius:10,overflow:'hidden',background:'var(--canvas)',flexShrink:0 }}>
                  <img src={p.image} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} loading="lazy"/>
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <p style={{ fontSize:'0.875rem',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{p.name}</p>
                  <p style={{ fontSize:'0.75rem',color:'var(--slate)' }}>{p.reviews} reviews · ★{p.rating}</p>
                </div>
                <span style={{ fontWeight:800,fontSize:'0.9375rem',flexShrink:0 }}>£{p.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'0.875rem' }}>
        {[
          { label:'Add Product', href:'/admin/goingintodeep/add-product', icon:Plus,         desc:'List a new item' },
          { label:'All Products',href:'/admin/goingintodeep/products',     icon:Package,      desc:'Edit catalogue' },
          { label:'View Orders', href:'/admin/goingintodeep/orders',       icon:ShoppingCart, desc:'Manage orders' },
          { label:'View Store',  href:'/',                                  icon:Eye,          desc:'Front end preview' },
        ].map(({ label, href, icon:Icon, desc })=>(
          <Link key={href} href={href}
            style={{ display:'block',textDecoration:'none',padding:'1.125rem',border:'1.5px solid var(--hairline)',borderRadius:16,background:'#fff',transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--violet)';e.currentTarget.style.background='rgba(84,51,235,0.03)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--hairline)';e.currentTarget.style.background='#fff';}}>
            <Icon size={18} style={{color:'var(--violet)',marginBottom:'0.625rem'}}/>
            <p style={{ fontSize:'0.9375rem',fontWeight:700,letterSpacing:'-0.02em',marginBottom:'0.25rem',color:'var(--ink)' }}>{label}</p>
            <p style={{ fontSize:'0.8125rem',color:'var(--slate)' }}>{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
