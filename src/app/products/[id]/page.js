'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingBag, Heart, Star, Leaf, Truck, Shield, Minus, Plus, ChevronRight, Check, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/product/ProductCard';
import productsData from '@/lib/products.json';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('not found');
        const data = await res.json();
        const p = { ...data.product, id: (data.product.id || data.product._id)?.toString() };
        setProduct(p);
        setRelated(productsData.filter(r => r.category === p.category && r.id !== p.id).slice(0, 4));
      } catch {
        const p = productsData.find(p => p.id === id || p.slug === id);
        setProduct(p || null);
        if (p) setRelated(productsData.filter(r => r.category === p.category && r.id !== p.id).slice(0, 4));
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return (
    <div className="page-container" style={{ padding: '40px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div className="skeleton" style={{ aspectRatio: '1/1', borderRadius: 'var(--radius-img)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 20 }}>
          {[60, 40, 80, 50, 30, 100].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: i === 0 ? 36 : 16, width: `${w}%`, borderRadius: 6 }} />
          ))}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Product Not Found</h1>
      <Link href="/products" className="btn-violet" style={{ fontSize: 14 }}>Back to Products</Link>
    </div>
  );

  const images = product.images?.length ? product.images : [product.image];
  const wishlisted = isWishlisted(product.id);

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--canvas)', borderBottom: '1px solid var(--hairline)', padding: '12px 0' }}>
        <div className="page-container" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {[['Home', '/'], ['Products', '/products'], [product.category, `/products?category=${encodeURIComponent(product.category)}`], [product.name, '#']].map(([label, href], i, arr) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i < arr.length - 1 ? (
                <Link href={href} style={{ fontSize: 12, color: 'var(--slate)', textDecoration: 'none', transition: 'color 0.15s' }}
                  className="hover:text-[var(--ink)]">{label}</Link>
              ) : (
                <span style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 500 }}>{label}</span>
              )}
              {i < arr.length - 1 && <ChevronRight size={11} style={{ color: 'var(--concrete)' }} />}
            </span>
          ))}
        </div>
      </div>

      <div className="page-container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px 56px', marginBottom: 64 }}>
          {/* Images */}
          <div className="anim-fade-in">
            <div style={{ borderRadius: 'var(--radius-img)', overflow: 'hidden', background: 'var(--canvas)', aspectRatio: '1/1', marginBottom: 12, border: '1px solid var(--hairline)' }}>
              <img src={images[imgIdx]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    style={{ width: 72, height: 72, border: `2px solid ${i === imgIdx ? 'var(--violet)' : 'var(--hairline)'}`, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--canvas)', cursor: 'pointer', padding: 0, transition: 'border-color 0.15s', flexShrink: 0 }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="anim-fade-up">
            {/* Tags */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {product.isFlashSale && <span className="tag tag-red"><Zap size={10} fill="currentColor" /> -{product.discount}% SALE</span>}
              {product.isNewArrival && <span className="tag tag-violet">NEW ARRIVAL</span>}
              {product.isOrganic && <span className="tag tag-green"><Leaf size={10} /> ORGANIC</span>}
              {product.isBestSeller && <span className="tag tag-dark">⭐ BESTSELLER</span>}
            </div>

            <p style={{ fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 8 }}>{product.category}</p>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 6 }}>{product.name}</h1>
            <p style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 16 }}>{product.unit} · {product.weight}</p>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--hairline)' }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'} style={{ color: s <= Math.round(product.rating) ? '#f59e0b' : 'var(--concrete)' }} />)}
              </div>
              <span style={{ fontSize: 13, color: 'var(--slate)' }}>{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em' }}>£{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span style={{ fontSize: 20, color: 'var(--slate)', textDecoration: 'line-through', marginLeft: 12 }}>£{product.originalPrice.toFixed(2)}</span>
                  <span className="tag tag-red" style={{ marginLeft: 10, verticalAlign: 'middle' }}>
                    Save £{(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: product.stock > 10 ? 'var(--accent-green)' : product.stock > 0 ? '#f59e0b' : '#ef4444' }} />
              <span style={{ fontSize: 13, color: 'var(--slate)' }}>
                {product.stock > 10 ? `In Stock (${product.stock} available)` : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </span>
            </div>

            {/* Qty */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: 'var(--slate)' }}>Quantity</span>
              <div className="qty-control" style={{ borderRadius: 'var(--radius-pill)' }}>
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={14} /></button>
                <span className="qty-num" style={{ fontWeight: 700, fontSize: 15 }}>{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}><Plus size={14} /></button>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <button onClick={() => addToCart({ ...product }, qty)} disabled={product.stock === 0}
                className="btn-violet" style={{ flex: 3, fontSize: 15, padding: '14px 20px', minWidth: 160, opacity: product.stock === 0 ? 0.4 : 1 }}>
                <ShoppingBag size={16} /> Add to Cart
              </button>
              <button onClick={() => toggle(product)}
                style={{ width: 52, height: 52, borderRadius: 'var(--radius-pill)', border: `2px solid ${wishlisted ? '#ef4444' : 'var(--hairline)'}`, background: wishlisted ? '#fee2e2' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0, color: wishlisted ? '#ef4444' : 'var(--slate)' }}>
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
            <Link href="/checkout" onClick={() => addToCart({ ...product }, qty)}
              className="btn-outline" style={{ display: 'flex', width: '100%', justifyContent: 'center', fontSize: 15, padding: '13px' }}>
              Buy Now <ArrowRight size={16} />
            </Link>

            {/* Trust */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 24 }}>
              {[{ icon: Truck, text: 'Free over £50' }, { icon: Shield, text: 'Freshness guarantee' }, { icon: Leaf, text: 'Organic certified' }].map(({ icon: Icon, text }) => (
                <div key={text} style={{ background: 'var(--canvas)', borderRadius: 'var(--radius-sm)', padding: '10px 8px', textAlign: 'center' }}>
                  <Icon size={16} style={{ color: 'var(--violet)', marginBottom: 5 }} />
                  <p style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: '-0.01em' }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--hairline)', marginBottom: 28, gap: 0 }}>
            {[['description', 'Description'], ['highlights', 'Key Highlights'], ['nutrition', 'Nutrition Facts']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                style={{ padding: '12px 20px', fontSize: 13, fontWeight: tab === key ? 600 : 400, letterSpacing: '-0.02em', background: 'none', border: 'none', cursor: 'pointer', borderBottom: `2px solid ${tab === key ? 'var(--ink)' : 'transparent'}`, color: tab === key ? 'var(--ink)' : 'var(--slate)', transition: 'all 0.15s', marginBottom: -1, fontFamily: 'inherit' }}>
                {label}
              </button>
            ))}
          </div>
          <div className="anim-fade-in" style={{ maxWidth: 600 }}>
            {tab === 'description' && <p style={{ fontSize: 15, color: 'var(--ash)', lineHeight: 1.75 }}>{product.description}</p>}
            {tab === 'highlights' && (
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {product.highlights?.map((h, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Check size={12} style={{ color: 'var(--accent-green)' }} />
                    </div>
                    <span style={{ fontSize: 15, color: 'var(--ash)', lineHeight: 1.5 }}>{h}</span>
                  </li>
                ))}
              </ul>
            )}
            {tab === 'nutrition' && product.nutrition && (
              <div style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '2px solid var(--ink)', background: 'var(--canvas)' }}>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>Nutrition Facts</p>
                  <p style={{ fontSize: 12, color: 'var(--slate)' }}>Per 100g serving</p>
                </div>
                {Object.entries(product.nutrition).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 16px', borderBottom: '1px solid var(--hairline)', fontSize: 13 }}>
                    <span style={{ color: 'var(--ash)', textTransform: 'capitalize' }}>{k}</span>
                    <span style={{ fontWeight: 600 }}>{v}{k === 'calories' ? ' kcal' : ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 24 }}>You May Also Like</h2>
            <div className="product-grid">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*='1fr 1fr'] { grid-template-columns: 1fr !important; gap: 24px !important; }
          div[style*='repeat(3,1fr)'] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
