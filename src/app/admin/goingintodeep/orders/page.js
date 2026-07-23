'use client';
import { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp, Search } from 'lucide-react';

const SC = { pending:{l:'Pending',bg:'#fef3c7',c:'#92400e'}, confirmed:{l:'Confirmed',bg:'#dbeafe',c:'#1e40af'}, preparing:{l:'Preparing',bg:'#ede9fe',c:'#7c3aed'}, dispatched:{l:'Dispatched',bg:'#d1fae5',c:'#065f46'}, delivered:{l:'Delivered',bg:'#d1fae5',c:'#059669'}, cancelled:{l:'Cancelled',bg:'#fee2e2',c:'#991b1b'} };
const ALL_S = Object.keys(SC);

export default function AdminOrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [sf, setSf]           = useState('all');
  const [expanded, setExp]    = useState(null);
  const [updating, setUpd]    = useState(null);

  useEffect(()=>{
    fetch('/api/orders').then(r=>r.json()).then(d=>{setOrders(d.orders||[]);setLoading(false);}).catch(()=>setLoading(false));
  },[]);

  const upd = async (id, status) => {
    setUpd(id);
    try {
      await fetch(`/api/orders/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});
      setOrders(os=>os.map(o=>(o._id===id||o.orderNumber===id)?{...o,status}:o));
    } catch { alert('Could not update.'); }
    setUpd(null);
  };

  const filtered = orders.filter(o=>{
    const ms = !search||o.orderNumber?.toLowerCase().includes(search.toLowerCase())||o.customer?.name?.toLowerCase().includes(search.toLowerCase());
    const mf = sf==='all'||o.status===sf;
    return ms&&mf;
  });

  return (
    <div style={{ padding:'clamp(1.5rem,4vw,2.5rem)' }}>
      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontSize:'clamp(1.5rem,3vw,2rem)',fontWeight:800,letterSpacing:'-0.03em',marginBottom:'0.25rem' }}>Orders</h1>
        <p style={{ color:'var(--slate)',fontSize:'0.9375rem' }}>{orders.length} total orders</p>
      </div>

      {/* Status chips */}
      <div style={{ display:'flex',gap:'0.375rem',flexWrap:'wrap',marginBottom:'1rem' }}>
        <button onClick={()=>setSf('all')} className={`chip${sf==='all'?' active':''}`}>All ({orders.length})</button>
        {ALL_S.map(s=>(
          <button key={s} onClick={()=>setSf(s)} className={`chip${sf===s?' active':''}`}>
            {SC[s].l} ({orders.filter(o=>o.status===s).length})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="admin-card" style={{ padding:'0.875rem 1rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.75rem' }}>
        <Search size={16} style={{color:'var(--muted)',flexShrink:0}}/>
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by order # or customer name..."
          style={{ flex:1,border:'none',outline:'none',fontSize:'0.9375rem',fontFamily:'inherit',color:'var(--ink)',background:'transparent' }}/>
      </div>

      {loading ? (
        <div style={{ display:'flex',flexDirection:'column',gap:'0.625rem' }}>
          {[...Array(4)].map((_,i)=><div key={i} className="skeleton admin-card" style={{height:72,borderRadius:16}}/>)}
        </div>
      ) : filtered.length===0 ? (
        <div className="admin-card" style={{ padding:'4rem',textAlign:'center' }}>
          <Package size={40} style={{color:'var(--muted)',margin:'0 auto 1rem'}}/>
          <p style={{color:'var(--slate)',fontSize:'0.9375rem'}}>No orders found</p>
        </div>
      ) : (
        <div style={{ display:'flex',flexDirection:'column',gap:'0.625rem' }}>
          {filtered.map(order=>{
            const id = order._id||order.orderNumber;
            const s = SC[order.status]||SC.pending;
            const exp = expanded===id;
            return (
              <div key={id} className="admin-card" style={{ overflow:'hidden' }}>
                <div style={{ display:'flex',alignItems:'center',gap:'1rem',padding:'1rem 1.25rem',cursor:'pointer' }}
                  onClick={()=>setExp(exp?null:id)}>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ display:'flex',alignItems:'center',gap:'0.625rem',marginBottom:'0.25rem' }}>
                      <p style={{ fontWeight:800,fontSize:'1rem' }}>{order.orderNumber}</p>
                      <span style={{ fontSize:'0.625rem',padding:'3px 9px',borderRadius:99,background:s.bg,color:s.c,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.04em',flexShrink:0 }}>{s.l}</span>
                    </div>
                    <p style={{ fontSize:'0.8125rem',color:'var(--slate)' }}>{order.customer?.name} · {order.customer?.phone}</p>
                  </div>
                  <div style={{ textAlign:'center',flexShrink:0 }}>
                    <p style={{ fontWeight:700,fontSize:'0.9375rem' }}>{order.items?.length||0}</p>
                    <p style={{ fontSize:'0.6875rem',color:'var(--muted)' }}>items</p>
                  </div>
                  <div style={{ textAlign:'right',flexShrink:0 }}>
                    <p style={{ fontWeight:900,fontSize:'1.125rem',letterSpacing:'-0.025em' }}>৳{order.total?.toFixed(2)}</p>
                    <p style={{ fontSize:'0.75rem',color:'var(--slate)' }}>{order.createdAt?new Date(order.createdAt).toLocaleDateString('en-GB'):'—'}</p>
                  </div>
                  <div onClick={e=>e.stopPropagation()} style={{ flexShrink:0 }}>
                    <select value={order.status} disabled={updating===id} onChange={e=>upd(id,e.target.value)}
                      style={{ appearance:'none',border:'1.5px solid var(--hairline)',borderRadius:100,background:'#fff',padding:'0.4rem 0.875rem',fontSize:'0.8125rem',outline:'none',cursor:'pointer',fontFamily:'inherit',minWidth:110,color:'var(--ink)' }}>
                      {ALL_S.map(s=><option key={s} value={s}>{SC[s].l}</option>)}
                    </select>
                  </div>
                  {exp?<ChevronUp size={16} style={{color:'var(--muted)',flexShrink:0}}/>:<ChevronDown size={16} style={{color:'var(--muted)',flexShrink:0}}/>}
                </div>

                {exp && (
                  <div style={{ padding:'0 1.25rem 1.25rem',borderTop:'1px solid var(--hairline)',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,260px),1fr))',gap:'1.5rem',paddingTop:'1.25rem' }}
                    className="afi">
                    <div>
                      <p style={{ fontSize:'0.6875rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--slate)',marginBottom:'0.625rem' }}>Delivery Address</p>
                      <p style={{ fontWeight:600 }}>{order.customer?.name}</p>
                      <p style={{ fontSize:'0.9375rem',color:'var(--slate)',lineHeight:1.6 }}>{order.customer?.address}<br/>{order.customer?.city} {order.customer?.postcode}<br/>{order.customer?.phone}</p>
                      {order.customer?.notes&&<p style={{ fontSize:'0.8125rem',color:'var(--muted)',marginTop:'0.5rem',fontStyle:'italic' }}>Note: {order.customer.notes}</p>}
                    </div>
                    <div>
                      <p style={{ fontSize:'0.6875rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--slate)',marginBottom:'0.625rem' }}>Items Ordered</p>
                      <div style={{ display:'flex',flexDirection:'column',gap:'0.625rem' }}>
                        {order.items?.map((item,i)=>(
                          <div key={i} style={{ display:'flex',alignItems:'center',gap:'0.625rem' }}>
                            {item.image&&<div style={{width:36,height:36,borderRadius:9,overflow:'hidden',background:'var(--canvas)',flexShrink:0}}><img src={item.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>}
                            <div style={{ flex:1,minWidth:0 }}>
                              <p style={{ fontSize:'0.875rem',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{item.name}</p>
                              <p style={{ fontSize:'0.75rem',color:'var(--slate)' }}>Qty: {item.quantity}</p>
                            </div>
                            <span style={{ fontWeight:700,fontSize:'0.9375rem',flexShrink:0 }}>৳{(item.price*item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop:'0.875rem',paddingTop:'0.875rem',borderTop:'1px solid var(--hairline)',display:'flex',flexDirection:'column',gap:'0.375rem' }}>
                        {[['Subtotal',`৳${order.subtotal?.toFixed(2)}`],['Delivery',order.deliveryFee===0?'Free':`৳${order.deliveryFee?.toFixed(2)}`],['Total',`৳${order.total?.toFixed(2)}`]].map(([l,v])=>(
                          <div key={l} style={{ display:'flex',justifyContent:'space-between',fontSize:l==='Total'?'1rem':'0.875rem' }}>
                            <span style={{color:'var(--slate)'}}>{l}</span>
                            <span style={{fontWeight:l==='Total'?900:500}}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
