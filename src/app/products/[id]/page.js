'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingBag, Heart, Star, Leaf, Truck, Shield, Minus, Plus, ChevronRight, Check, Zap, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/product/ProductCard';
import productsData from '@/lib/products.json';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx]   = useState(0);
  const [qty, setQty]         = useState(1);
  const [tab, setTab]         = useState('description');
  const { addToCart }  = useCart();
  const { toggle, isWishlisted } = useWishlist();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/products/${id}`);
        if (!r.ok) throw new Error();
        const d = await r.json();
        const p = { ...d.product, id: (d.product.id || d.product._id)?.toString() };
        setProduct(p);
        setRelated(productsData.filter(r => r.category === p.category && r.id !== p.id).slice(0, 4));
      } catch {
        const p = productsData.find(p => p.id === id || p.slug === id);
        setProduct(p || null);
        if (p) setRelated(productsData.filter(r => r.category === p.category && r.id !== p.id).slice(0, 4));
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return (
    <div className="container" style={{ padding: 'clamp(2rem,5vw,3.5rem) 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: '3rem' }}>
        <div className="skeleton" style={{ aspectRatio: '1/1', borderRadius: 20 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem' }}>
          {[55,40,70,45,100,60].map((w,i) => <div key={i} className="skeleton" style={{ height: i===0?32:14, width:`${w}%`, borderRadius:8 }} />)}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div style={{ textAlign:'center', padding:'6rem 1rem' }}>
      <Package size={56} style={{ color:'var(--muted)', margin:'0 auto 1rem' }} />
      <h1 className="t-h2" style={{ marginBottom:'0.75rem' }}>Product Not Found</h1>
      <Link href="/products" className="btn btn-primary" style={{ display:'inline-flex' }}>Back to Products</Link>
    </div>
  );

  const images   = product.images?.length ? product.images : [product.image];
  const wishlisted = isWishlisted(product.id);

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--hairline)', padding: '0.75rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
          {[['Home','/'],['Products','/products'],[product.category,`/products?category=${encodeURIComponent(product.category)}`],[product.name,'#']].map(([label,href],i,arr) => (
            <span key={label} style={{ display:'flex',alignItems:'center',gap:'0.375rem' }}>
              {i < arr.length-1
                ? <Link href={href} style={{ fontSize:'0.8125rem',color:'var(--slate)',transition:'color 0.15s' }}
                    onMouseEnter={e=>e.target.style.color='var(--ink)'}
                    onMouseLeave={e=>e.target.style.color='var(--slate)'}>{label}</Link>
                : <span style={{ fontSize:'0.8125rem',color:'var(--ink)',fontWeight:500 }}>{label}</span>
              }
              {i < arr.length-1 && <ChevronRight size={11} style={{ color:'var(--muted)' }} />}
            </span>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="container" style={{ padding:'clamp(2rem,5vw,3.5rem) 0' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap:'clamp(2rem,5vw,4rem)', marginBottom:'clamp(3rem,8vw,5rem)' }}>

          {/* Images */}
          <div className="afi">
            <div style={{ borderRadius:20, overflow:'hidden', background:'var(--canvas)', aspectRatio:'1/1', marginBottom:'0.75rem', border:'1px solid var(--hairline)', position:'relative' }}>
              <img src={images[imgIdx]} alt={product.name} style={{ width:'100%',height:'100%',objectFit:'cover',transition:'opacity 0.3s' }} />
              {product.isFlashSale && (
                <div style={{ position:'absolute',top:'1rem',left:'1rem' }}>
                  <span className="tag tag-red" style={{ fontSize:'0.8125rem',padding:'6px 14px' }}>
                    <Zap size={12} fill="currentColor" /> -{product.discount}% OFF
                  </span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display:'flex',gap:'0.625rem',overflowX:'auto',scrollbarWidth:'none' }}>
                {images.map((img,i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    style={{ width:72,height:72,flexShrink:0,border:`2.5px solid ${i===imgIdx?'var(--violet)':'var(--hairline)'}`,borderRadius:12,overflow:'hidden',background:'var(--canvas)',cursor:'pointer',padding:0,transition:'border-color 0.15s' }}>
                    <img src={img} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="afu">
            {/* Badges */}
            <div style={{ display:'flex',gap:'0.375rem',flexWrap:'wrap',marginBottom:'1rem' }}>
              {product.isNewArrival  && <span className="tag tag-violet">NEW ARRIVAL</span>}
              {product.isOrganic     && <span className="tag tag-green"><Leaf size={10}/>ORGANIC</span>}
              {product.isBestSeller  && <span className="tag tag-dark">⭐ BESTSELLER</span>}
            </div>

            <p className="t-label" style={{ color:'var(--muted)',marginBottom:'0.375rem' }}>{product.category}</p>
            <h1 className="t-h1" style={{ marginBottom:'0.375rem' }}>{product.name}</h1>
            <p className="t-small" style={{ marginBottom:'1rem' }}>{product.unit} · {product.weight}</p>

            {/* Stars */}
            <div style={{ display:'flex',alignItems:'center',gap:'0.625rem',marginBottom:'1.25rem',paddingBottom:'1.25rem',borderBottom:'1px solid var(--hairline)' }}>
              <div style={{ display:'flex',gap:2 }}>
                {[1,2,3,4,5].map(s=>(
                  <Star key={s} size={15} fill={s<=Math.round(product.rating)?'#f59e0b':'none'} style={{color:s<=Math.round(product.rating)?'#f59e0b':'#ddd'}} />
                ))}
              </div>
              <span style={{ fontSize:'0.875rem',color:'var(--slate)' }}>{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ marginBottom:'1rem' }}>
              <span style={{ fontSize:'clamp(2rem,5vw,2.5rem)',fontWeight:900,letterSpacing:'-0.04em' }}>£{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span style={{ fontSize:'1.25rem',color:'var(--muted)',textDecoration:'line-through',marginLeft:'0.75rem' }}>£{product.originalPrice.toFixed(2)}</span>
                  <span className="tag tag-red" style={{ marginLeft:'0.625rem',verticalAlign:'middle' }}>
                    Save £{(product.originalPrice-product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div style={{ display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1.5rem' }}>
              <div style={{ width:8,height:8,borderRadius:'50%',background:product.stock>10?'var(--green)':product.stock>0?'#f59e0b':'#e74c3c',flexShrink:0 }} />
              <span style={{ fontSize:'0.875rem',color:'var(--slate)' }}>
                {product.stock>10?`In Stock (${product.stock} available)`:product.stock>0?`Only ${product.stock} left!`:'Out of Stock'}
              </span>
            </div>

            {/* Qty */}
            <div style={{ display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.25rem' }}>
              <span style={{ fontSize:'0.875rem',color:'var(--slate)',minWidth:60 }}>Quantity</span>
              <div className="qty-ctrl" style={{ border:'1.5px solid var(--hairline)' }}>
                <button className="qty-btn" onClick={()=>setQty(q=>Math.max(1,q-1))}><Minus size={14}/></button>
                <span className="qty-num" style={{ fontSize:'1rem',fontWeight:800 }}>{qty}</span>
                <button className="qty-btn" onClick={()=>setQty(q=>Math.min(product.stock,q+1))}><Plus size={14}/></button>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display:'flex',gap:'0.75rem',marginBottom:'0.75rem',flexWrap:'wrap' }}>
              <button onClick={()=>addToCart({...product},qty)} disabled={product.stock===0}
                className="btn btn-primary btn-lg"
                style={{ flex:1,justifyContent:'center',minWidth:160,opacity:product.stock===0?0.4:1 }}>
                <ShoppingBag size={17}/> Add to Cart
              </button>
              <button onClick={()=>toggle(product)}
                style={{ width:52,height:52,borderRadius:'50%',border:`2px solid ${wishlisted?'#e74c3c':'var(--hairline)'}`,background:wishlisted?'#fee2e2':'#fff',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.2s',color:wishlisted?'#e74c3c':'var(--slate)',flexShrink:0 }}>
                <Heart size={19} fill={wishlisted?'currentColor':'none'}/>
              </button>
            </div>
            <Link href="/checkout" onClick={()=>addToCart({...product},qty)}
              className="btn btn-outline btn-lg"
              style={{ width:'100%',justifyContent:'center',display:'flex' }}>
              Buy Now <ArrowRight size={17}/>
            </Link>

            {/* Trust strip */}
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.625rem',marginTop:'1.5rem' }}>
              {[{icon:Truck,t:'Free £50+'},{icon:Shield,t:'Freshness Guar.'},{icon:Leaf,t:'Organic'}].map(({icon:Icon,t})=>(
                <div key={t} style={{ background:'var(--off-white)',borderRadius:12,padding:'0.75rem 0.5rem',textAlign:'center',border:'1px solid var(--hairline)' }}>
                  <Icon size={16} style={{color:'var(--violet)',marginBottom:5}}/>
                  <p style={{ fontSize:'0.6875rem',color:'var(--slate)',letterSpacing:'-0.01em' }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom:'clamp(3rem,8vw,5rem)' }}>
          <div style={{ display:'flex',borderBottom:'1px solid var(--hairline)',marginBottom:'2rem',overflowX:'auto',scrollbarWidth:'none' }}>
            {[['description','Description'],['highlights','Key Highlights'],['nutrition','Nutrition Facts']].map(([key,label])=>(
              <button key={key} onClick={()=>setTab(key)}
                style={{ padding:'0.875rem 1.25rem',fontSize:'0.9375rem',fontWeight:tab===key?700:400,background:'none',border:'none',cursor:'pointer',borderBottom:`2.5px solid ${tab===key?'var(--ink)':'transparent'}`,color:tab===key?'var(--ink)':'var(--slate)',transition:'all 0.15s',marginBottom:-1,fontFamily:'inherit',whiteSpace:'nowrap' }}>
                {label}
              </button>
            ))}
          </div>
          <div className="afi" key={tab} style={{ maxWidth:680 }}>
            {tab==='description' && (
              <div className="t-body prose-content" style={{ fontSize:'clamp(0.9375rem,2vw,1.0625rem)',lineHeight:1.8 }}>
                <Markdown remarkPlugins={[remarkGfm]}>{product.description || ''}</Markdown>
              </div>
            )}
            {tab==='highlights' && (
              <ul style={{ display:'flex',flexDirection:'column',gap:'0.875rem',listStyle:'none' }}>
                {product.highlights?.map((h,i)=>(
                  <li key={i} style={{ display:'flex',alignItems:'flex-start',gap:'0.875rem' }}>
                    <div style={{ width:24,height:24,borderRadius:'50%',background:'var(--green-pale)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1 }}>
                      <Check size={13} style={{color:'var(--green)'}}/>
                    </div>
                    <span style={{ fontSize:'clamp(0.9375rem,2vw,1rem)',color:'var(--slate)',lineHeight:1.6 }}>{h}</span>
                  </li>
                ))}
              </ul>
            )}
            {tab==='nutrition' && product.nutrition && (
              <div style={{ border:'1px solid var(--hairline)',borderRadius:16,overflow:'hidden' }}>
                <div style={{ padding:'1rem 1.25rem',background:'var(--ink)',color:'#fff' }}>
                  <p style={{ fontWeight:800,fontSize:'1rem',letterSpacing:'-0.02em' }}>Nutrition Facts</p>
                  <p style={{ fontSize:'0.8125rem',color:'rgba(255,255,255,0.5)',marginTop:2 }}>Per 100g serving</p>
                </div>
                {Object.entries(product.nutrition).map(([k,v])=>(
                  <div key={k} style={{ display:'flex',justifyContent:'space-between',padding:'0.875rem 1.25rem',borderBottom:'1px solid var(--hairline)',fontSize:'0.9375rem' }}>
                    <span style={{ color:'var(--slate)',textTransform:'capitalize' }}>{k}</span>
                    <span style={{ fontWeight:700 }}>{v}{k==='calories'?' kcal':''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length>0 && (
          <div>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'0.75rem' }}>
              <h2 className="t-h2">You May Also Like</h2>
              <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="btn btn-ghost" style={{ color:'var(--slate)',display:'flex',alignItems:'center',gap:4,fontSize:'0.875rem' }}>
                More like this <ArrowRight size={14}/>
              </Link>
            </div>
            <div className="product-grid">
              {related.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
