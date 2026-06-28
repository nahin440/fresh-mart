'use client';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, count } = useCart();
  const fee = total >= 50 ? 0 : 3.99;
  const progress = Math.min((total/50)*100,100);

  return (
    <div style={{ minHeight:'70vh', background:'var(--off-white)' }}>
      <div style={{ background:'#fff', borderBottom:'1px solid var(--hairline)', padding:'clamp(2rem,5vw,3rem) 0' }}>
        <div className="container">
          <span className="eyebrow">Your Basket</span>
          <h1 className="t-h1">Shopping Cart {count>0&&<span style={{fontWeight:400,color:'var(--muted)'}}> ({count})</span>}</h1>
        </div>
      </div>

      <div className="container" style={{ padding:'clamp(2rem,5vw,3rem) 0' }}>
        {items.length===0 ? (
          <div style={{ textAlign:'center',padding:'5rem 1rem',display:'flex',flexDirection:'column',alignItems:'center',gap:'1.25rem' }}>
            <div style={{ width:88,height:88,borderRadius:24,background:'var(--canvas)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <ShoppingBag size={40} style={{color:'var(--muted)'}}/>
            </div>
            <h2 className="t-h2">Your cart is empty</h2>
            <p className="t-body">Add some items to get started.</p>
            <Link href="/products" className="btn btn-primary btn-lg" style={{ display:'inline-flex',marginTop:'0.5rem' }}>Browse Products <ArrowRight size={17}/></Link>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap:'2rem', alignItems:'start' }}>

            {/* Items */}
            <div style={{ minWidth:0 }}>
              <div style={{ borderTop:'1px solid var(--hairline)' }}>
                {items.map(item=>(
                  <div key={item.id} style={{ display:'flex',gap:'clamp(0.75rem,3vw,1.25rem)',padding:'clamp(1rem,3vw,1.5rem) 0',borderBottom:'1px solid var(--hairline)' }}>
                    <Link href={`/products/${item.id}`}
                      style={{ width:'clamp(72px,18vw,96px)',height:'clamp(72px,18vw,96px)',flexShrink:0,borderRadius:14,overflow:'hidden',background:'var(--canvas)',display:'block' }}>
                      <img src={item.image} alt={item.name}
                        style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.35s' }}
                        onMouseEnter={e=>e.target.style.transform='scale(1.07)'}
                        onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                    </Link>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ display:'flex',justifyContent:'space-between',gap:'0.75rem',marginBottom:'0.25rem' }}>
                        <Link href={`/products/${item.id}`} style={{ fontWeight:600,fontSize:'clamp(0.875rem,2.5vw,1rem)',letterSpacing:'-0.02em',color:'var(--ink)',transition:'color 0.15s' }}
                          onMouseEnter={e=>e.target.style.color='var(--violet)'}
                          onMouseLeave={e=>e.target.style.color='var(--ink)'}>
                          {item.name}
                        </Link>
                        <span style={{ fontWeight:800,fontSize:'clamp(1rem,2.5vw,1.125rem)',letterSpacing:'-0.025em',flexShrink:0 }}>£{(item.price*item.quantity).toFixed(2)}</span>
                      </div>
                      <p style={{ fontSize:'0.8125rem',color:'var(--muted)',marginBottom:'0.875rem' }}>{item.unit} · £{item.price.toFixed(2)} each</p>
                      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'0.5rem' }}>
                        <div className="qty-ctrl" style={{ border:'1.5px solid var(--hairline)' }}>
                          <button className="qty-btn" onClick={()=>updateQuantity(item.id,item.quantity-1)} disabled={item.quantity<=1} style={{opacity:item.quantity<=1?0.3:1}}><Minus size={13}/></button>
                          <span className="qty-num" style={{fontWeight:800}}>{item.quantity}</span>
                          <button className="qty-btn" onClick={()=>updateQuantity(item.id,item.quantity+1)}><Plus size={13}/></button>
                        </div>
                        <button onClick={()=>removeFromCart(item.id)}
                          style={{ display:'flex',alignItems:'center',gap:'0.3rem',fontSize:'0.8125rem',color:'var(--muted)',background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',transition:'color 0.15s' }}
                          onMouseEnter={e=>e.currentTarget.style.color='#e74c3c'}
                          onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}>
                          <Trash2 size={14}/> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:'1rem' }}>
                <Link href="/products" style={{ fontSize:'0.875rem',color:'var(--slate)',display:'inline-flex',alignItems:'center',gap:4,transition:'color 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.color='var(--ink)'}
                  onMouseLeave={e=>e.currentTarget.style.color='var(--slate)'}>
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Summary */}
            <div style={{ position:'sticky',top:76 }}>
              <div style={{ background:'#fff',borderRadius:20,border:'1px solid var(--hairline)',padding:'clamp(1.25rem,4vw,1.75rem)' }}>
                <h2 style={{ fontWeight:800,fontSize:'1.0625rem',letterSpacing:'-0.025em',marginBottom:'1.25rem' }}>Order Summary</h2>

                {total < 50 && (
                  <div style={{ background:'var(--canvas)',borderRadius:12,padding:'1rem',marginBottom:'1.25rem' }}>
                    <p style={{ fontSize:'0.8125rem',color:'var(--slate)',marginBottom:'0.5rem' }}>
                      Add <strong style={{color:'var(--ink)'}}>£{(50-total).toFixed(2)}</strong> for free delivery
                    </p>
                    <div className="progress">
                      <div className="progress-fill" style={{width:`${progress}%`}}/>
                    </div>
                  </div>
                )}

                <div style={{ display:'flex',flexDirection:'column',gap:'0.625rem',marginBottom:'1.25rem' }}>
                  {[['Subtotal',`£${total.toFixed(2)}`],['Delivery',fee===0?'🎉 Free':`£${fee.toFixed(2)}`]].map(([l,v])=>(
                    <div key={l} style={{ display:'flex',justifyContent:'space-between',fontSize:'0.9375rem' }}>
                      <span style={{color:'var(--slate)'}}>{l}</span>
                      <span style={{fontWeight:600,color:fee===0&&l==='Delivery'?'var(--green)':'var(--ink)'}}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display:'flex',justifyContent:'space-between',fontSize:'clamp(1.125rem,3vw,1.25rem)',fontWeight:900,letterSpacing:'-0.03em',paddingTop:'0.875rem',borderTop:'1px solid var(--hairline)',marginTop:'0.25rem' }}>
                    <span>Total</span><span>£{(total+fee).toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/checkout" className="btn btn-primary btn-lg" style={{ width:'100%',justifyContent:'center',display:'flex' }}>
                  Checkout <ArrowRight size={17}/>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
