'use client';
import { useWishlist } from '@/context/WishlistContext';
import { useCart }     from '@/context/CartContext';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { items, toggle } = useWishlist();
  const { addToCart }     = useCart();

  return (
    <div style={{ minHeight:'70vh', background:'var(--off-white)' }}>
      <div style={{ background:'#fff', borderBottom:'1px solid var(--hairline)', padding:'clamp(2rem,5vw,3rem) 0' }}>
        <div className="container">
          <span className="eyebrow">Saved Items</span>
          <h1 className="t-h1">Your Wishlist</h1>
        </div>
      </div>

      <div className="container" style={{ padding:'clamp(2rem,5vw,3rem) 0' }}>
        {items.length===0 ? (
          <div style={{ textAlign:'center',padding:'5rem 1rem',display:'flex',flexDirection:'column',alignItems:'center',gap:'1.25rem' }}>
            <div style={{ width:88,height:88,borderRadius:24,background:'var(--canvas)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Heart size={40} style={{color:'var(--muted)'}}/>
            </div>
            <h2 className="t-h2">Nothing saved yet</h2>
            <p className="t-body" style={{ maxWidth:340 }}>Tap the ♡ on any product to save it here for later.</p>
            <Link href="/products" className="btn btn-primary btn-lg" style={{ display:'inline-flex',marginTop:'0.5rem' }}>
              Discover Products <ArrowRight size={17}/>
            </Link>
          </div>
        ) : (
          <>
            <p className="t-small" style={{ marginBottom:'1.5rem' }}>{items.length} saved {items.length===1?'item':'items'}</p>
            <div className="product-grid">
              {items.map((product,i)=>(
                <div key={product.id} className="card afu" style={{ animationDelay:`${i*0.07}s` }}>
                  <div style={{ position:'relative' }}>
                    <Link href={`/products/${product.id}`} style={{ display:'block' }}>
                      <div style={{ aspectRatio:'1/1',overflow:'hidden',background:'var(--canvas)' }}>
                        <img src={product.image} alt={product.name}
                          style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.45s ease' }}
                          onMouseEnter={e=>e.target.style.transform='scale(1.07)'}
                          onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                      </div>
                    </Link>
                    <button onClick={()=>toggle(product)}
                      style={{ position:'absolute',top:'0.75rem',right:'0.75rem',width:34,height:34,borderRadius:'50%',background:'rgba(255,255,255,0.92)',border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#e74c3c',boxShadow:'0 2px 8px rgba(0,0,0,0.12)' }}>
                      <Trash2 size={14}/>
                    </button>
                  </div>
                  <div style={{ padding:'clamp(0.75rem,2vw,1rem)' }}>
                    <p className="t-label" style={{ color:'var(--muted)',marginBottom:'0.25rem' }}>{product.subcategory}</p>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="t-h3" style={{ marginBottom:'0.375rem',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden' }}>{product.name}</h3>
                    </Link>
                    <p style={{ fontSize:'1.125rem',fontWeight:800,letterSpacing:'-0.025em',marginBottom:'0.875rem' }}>৳{product.price.toFixed(2)}</p>
                    <button onClick={()=>addToCart(product)} className="btn btn-primary btn-sm" style={{ width:'100%',justifyContent:'center' }}>
                      <ShoppingBag size={14}/> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
