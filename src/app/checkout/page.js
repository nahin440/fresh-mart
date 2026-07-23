'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Truck, CreditCard, CheckCircle, ArrowRight, Leaf, Check } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [step, setStep]     = useState(0);
  const [loading, setLoad]  = useState(false);
  const [orderNum, setNum]  = useState('');
  const [form, setForm]     = useState({ name:'', email:'', phone:'', address:'', city:'', postcode:'', notes:'' });
  const [errors, setErrors] = useState({});
  const fee = total >= 50 ? 0 : 3.99;

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name    = 'Required';
    if (!form.phone.trim())    e.phone   = 'Required';
    if (!form.address.trim())  e.address = 'Required';
    if (!form.city.trim())     e.city    = 'Required';
    if (!form.postcode.trim()) e.postcode= 'Required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = async () => {
    if (step===0) { if (!validate()) return; setStep(1); window.scrollTo(0,0); return; }
    setLoad(true);
    try {
      const r = await fetch('/api/orders', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ customer:form, items:items.map(i=>({productId:i.id,name:i.name,price:i.price,quantity:i.quantity,image:i.image})), subtotal:total, deliveryFee:fee, total:total+fee, paymentMethod:'cod' }) });
      const d = await r.json();
      setNum(d.orderNumber || 'FM'+Date.now().toString().slice(-8));
    } catch { setNum('FM'+Date.now().toString().slice(-8)); }
    clearCart(); setStep(2); setLoad(false); window.scrollTo(0,0);
  };

  if (items.length===0 && step!==2) return (
    <div style={{ textAlign:'center',padding:'6rem 1rem' }}>
      <h1 className="t-h2" style={{ marginBottom:'1rem' }}>Your cart is empty</h1>
      <Link href="/products" className="btn btn-primary" style={{ display:'inline-flex' }}>Start Shopping</Link>
    </div>
  );

  return (
    <div style={{ background:'var(--off-white)',minHeight:'100vh',padding:'clamp(2rem,5vw,3.5rem) 0' }}>
      <div className="container" style={{ maxWidth:940 }}>
        {/* Logo */}
        <div style={{ textAlign:'center',marginBottom:'2.5rem' }}>
          <Link href="/" style={{ display:'inline-flex',alignItems:'center',gap:'0.625rem' }}>
            <div style={{ width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,var(--green),#27ae60)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Leaf size={16} color="#fff"/>
            </div>
            <span style={{ fontWeight:900,fontSize:'1.125rem',letterSpacing:'-0.04em',color:'var(--ink)' }}>FRESHMART</span>
          </Link>
        </div>

        {/* Steps */}
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'2.5rem' }}>
          {['Delivery','Review','Done'].map((s,i)=>(
            <div key={s} style={{ display:'flex',alignItems:'center' }}>
              <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'0.375rem' }}>
                <div className="step-dot"
                  style={{ background:i<step?'var(--green)':i===step?'var(--violet)':'var(--hairline)', color:i<=step?'#fff':'var(--muted)', fontSize:'0.8125rem' }}>
                  {i<step?'✓':i+1}
                </div>
                <span style={{ fontSize:'0.6875rem',letterSpacing:'0.06em',textTransform:'uppercase',fontWeight:i===step?700:400,color:i===step?'var(--ink)':'var(--muted)' }}>{s}</span>
              </div>
              {i<2 && <div className="step-line" style={{ background:i<step?'var(--green)':'var(--hairline)',marginBottom:20,marginInline:4 }}/>}
            </div>
          ))}
        </div>

        {step===2 ? (
          <div style={{ background:'#fff',borderRadius:24,border:'1px solid var(--hairline)',padding:'clamp(2rem,6vw,3.5rem)',textAlign:'center',maxWidth:500,margin:'0 auto' }}>
            <div style={{ width:72,height:72,borderRadius:'50%',background:'var(--green-pale)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.5rem' }}>
              <CheckCircle size={36} style={{color:'var(--green)'}}/>
            </div>
            <h1 className="t-h2" style={{ marginBottom:'0.625rem' }}>Order Confirmed!</h1>
            <p className="t-body" style={{ marginBottom:'0.75rem' }}>Thank you, {form.name}!</p>
            <div style={{ background:'var(--off-white)',borderRadius:12,padding:'0.875rem 1.5rem',display:'inline-block',marginBottom:'1.25rem' }}>
              <span style={{ fontSize:'0.8125rem',color:'var(--slate)' }}>Order # </span>
              <span style={{ fontWeight:900,fontSize:'1.0625rem',letterSpacing:'-0.025em' }}>{orderNum}</span>
            </div>
            <p className="t-body" style={{ marginBottom:'2rem',maxWidth:360,margin:'0 auto 2rem' }}>
              Preparing your order for delivery to {form.address}, {form.city}. You'll receive updates shortly.
            </p>
            <Link href="/" className="btn btn-primary btn-lg" style={{ display:'inline-flex' }}>
              Continue Shopping <ArrowRight size={17}/>
            </Link>
          </div>
        ) : (
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,360px),1fr))',gap:'1.5rem',alignItems:'start' }}>
            {/* Form */}
            <div style={{ background:'#fff',borderRadius:20,border:'1px solid var(--hairline)',padding:'clamp(1.5rem,5vw,2rem)' }}>
              {step===0 && (
                <>
                  <h2 style={{ fontWeight:800,fontSize:'1.1875rem',letterSpacing:'-0.025em',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:'0.625rem' }}>
                    <div style={{ width:36,height:36,borderRadius:10,background:'var(--violet-pale)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                      <Truck size={17} style={{color:'var(--violet)'}}/>
                    </div>
                    Delivery Details
                  </h2>
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
                    {[
                      {n:'name',   l:'Full Name',       ph:'Jane Smith',         req:true,  full:true},
                      {n:'email',  l:'Email (optional)',ph:'jane@example.com',   type:'email',full:true},
                      {n:'phone',  l:'Phone',           ph:'+44 7700 900000',    req:true},
                      {n:'postcode',l:'Postcode',       ph:'SW1A 1AA',           req:true},
                      {n:'address',l:'Street Address',  ph:'12 High Street, 3A', req:true,  full:true},
                      {n:'city',   l:'City',            ph:'London',             req:true},
                    ].map(f=>(
                      <div key={f.n} style={{ gridColumn:f.full?'1/-1':'auto' }}>
                        <label style={{ display:'block',fontSize:'0.75rem',fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'var(--slate)',marginBottom:'0.375rem' }}>
                          {f.l}{f.req&&<span style={{color:'#e74c3c'}}> *</span>}
                        </label>
                        <input type={f.type||'text'} value={form[f.n]} onChange={e=>setForm(p=>({...p,[f.n]:e.target.value}))}
                          placeholder={f.ph} className="input"
                          style={{ borderColor:errors[f.n]?'#e74c3c':undefined }} />
                        {errors[f.n] && <p style={{fontSize:'0.75rem',color:'#e74c3c',marginTop:'0.25rem'}}>{errors[f.n]}</p>}
                      </div>
                    ))}
                    <div style={{ gridColumn:'1/-1' }}>
                      <label style={{ display:'block',fontSize:'0.75rem',fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'var(--slate)',marginBottom:'0.375rem' }}>Delivery Notes</label>
                      <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
                        placeholder="Leave by door, ring bell 2..." rows={3} className="input" style={{ resize:'none' }}/>
                    </div>
                  </div>
                </>
              )}

              {step===1 && (
                <>
                  <h2 style={{ fontWeight:800,fontSize:'1.1875rem',letterSpacing:'-0.025em',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:'0.625rem' }}>
                    <div style={{ width:36,height:36,borderRadius:10,background:'var(--violet-pale)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                      <CreditCard size={17} style={{color:'var(--violet)'}}/>
                    </div>
                    Review Order
                  </h2>
                  <div style={{ marginBottom:'1.25rem',paddingBottom:'1.25rem',borderBottom:'1px solid var(--hairline)' }}>
                    {items.map(item=>(
                      <div key={item.id} style={{ display:'flex',gap:'0.875rem',alignItems:'center',marginBottom:'0.875rem' }}>
                        <div style={{ width:56,height:56,borderRadius:12,overflow:'hidden',background:'var(--canvas)',flexShrink:0 }}>
                          <img src={item.image} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                        </div>
                        <div style={{ flex:1,minWidth:0 }}>
                          <p style={{ fontWeight:600,fontSize:'0.9375rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:'0.125rem' }}>{item.name}</p>
                          <p style={{ fontSize:'0.8125rem',color:'var(--slate)' }}>Qty: {item.quantity}</p>
                        </div>
                        <span style={{ fontWeight:800,fontSize:'1rem',flexShrink:0 }}>৳{(item.price*item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:'var(--off-white)',borderRadius:12,padding:'1rem',marginBottom:'1rem' }}>
                    <p style={{ fontSize:'0.75rem',fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'var(--slate)',marginBottom:'0.5rem' }}>Delivering To</p>
                    <p style={{ fontWeight:600,fontSize:'0.9375rem' }}>{form.name}</p>
                    <p style={{ fontSize:'0.875rem',color:'var(--slate)',lineHeight:1.6 }}>{form.address}, {form.city}, {form.postcode}<br/>{form.phone}</p>
                  </div>
                  <div style={{ background:'var(--off-white)',borderRadius:12,padding:'1rem' }}>
                    <p style={{ fontSize:'0.75rem',fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'var(--slate)',marginBottom:'0.5rem' }}>Payment</p>
                    <div style={{ display:'flex',alignItems:'center',gap:'0.625rem' }}>
                      <div style={{ width:18,height:18,borderRadius:'50%',background:'var(--violet)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                        <Check size={11} color="#fff"/>
                      </div>
                      <span style={{ fontWeight:600,fontSize:'0.9375rem' }}>Cash on Delivery</span>
                    </div>
                  </div>
                </>
              )}

              <div style={{ display:'flex',gap:'0.75rem',marginTop:'1.5rem' }}>
                {step>0 && <button onClick={()=>setStep(s=>s-1)} className="btn btn-outline" style={{flex:1,justifyContent:'center'}}>Back</button>}
                <button onClick={next} disabled={loading} className="btn btn-primary btn-lg"
                  style={{ flex:2,justifyContent:'center',opacity:loading?0.7:1 }}>
                  {loading?'Placing Order…':step===0?'Continue to Review':'Place Order'} {!loading&&<ArrowRight size={17}/>}
                </button>
              </div>
            </div>

            {/* Summary */}
            <div style={{ background:'#fff',borderRadius:20,border:'1px solid var(--hairline)',padding:'clamp(1.25rem,4vw,1.75rem)',position:'sticky',top:76 }}>
              <h3 style={{ fontWeight:800,fontSize:'0.9375rem',letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:'1.25rem' }}>Summary</h3>
              <div style={{ maxHeight:200,overflowY:'auto',marginBottom:'1rem',paddingBottom:'1rem',borderBottom:'1px solid var(--hairline)',scrollbarWidth:'thin' }}>
                {items.map(i=>(
                  <div key={i.id} style={{ display:'flex',justifyContent:'space-between',fontSize:'0.875rem',marginBottom:'0.5rem' }}>
                    <span style={{ color:'var(--slate)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginRight:'0.75rem' }}>{i.name} ×{i.quantity}</span>
                    <span style={{ fontWeight:600,flexShrink:0 }}>৳{(i.price*i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {[['Subtotal',`৳${total.toFixed(2)}`],['Delivery',fee===0?'Free':`৳${fee.toFixed(2)}`]].map(([l,v])=>(
                <div key={l} style={{ display:'flex',justifyContent:'space-between',fontSize:'0.9375rem',marginBottom:'0.625rem' }}>
                  <span style={{color:'var(--slate)'}}>{l}</span>
                  <span style={{fontWeight:600,color:fee===0&&l==='Delivery'?'var(--green)':'var(--ink)'}}>{v}</span>
                </div>
              ))}
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:'1.125rem',fontWeight:900,letterSpacing:'-0.025em',paddingTop:'0.875rem',borderTop:'1px solid var(--hairline)',marginTop:'0.25rem' }}>
                <span>Total</span><span>৳{(total+fee).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
