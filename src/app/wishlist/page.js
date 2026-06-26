'use client';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { items, toggle } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div style={{ minHeight: '70vh' }}>
      <div style={{ background: 'var(--canvas)', borderBottom: '1px solid var(--hairline)', padding: '32px 0' }}>
        <div className="page-container">
          <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: 6 }}>Saved Items</p>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em' }}>Wishlist</h1>
        </div>
      </div>

      <div className="page-container" style={{ padding: '40px 24px' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-img)', background: 'var(--canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={36} style={{ color: 'var(--concrete)' }} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>Your wishlist is empty</h2>
            <p style={{ fontSize: 14, color: 'var(--slate)', maxWidth: 320 }}>Save products you love by tapping the heart icon on any product card.</p>
            <Link href="/products" className="btn-violet" style={{ fontSize: 14, marginTop: 8 }}>
              Discover Products <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 24 }}>{items.length} saved {items.length === 1 ? 'item' : 'items'}</p>
            <div className="product-grid">
              {items.map((product, i) => (
                <div key={product.id} className="card anim-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div style={{ position: 'relative' }}>
                    <Link href={`/products/${product.id}`} style={{ display: 'block' }}>
                      <div style={{ aspectRatio: '1/1', overflow: 'hidden', background: 'var(--canvas)', borderRadius: 'var(--radius-img) var(--radius-img) 0 0' }}>
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                          onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                      </div>
                    </Link>
                    <button onClick={() => toggle(product)}
                      style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div style={{ padding: '12px 14px 14px' }}>
                    <p style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.subcategory}</p>
                    <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
                    </Link>
                    <p style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>£{product.price.toFixed(2)}</p>
                    <button onClick={() => addToCart(product)} className="btn-violet" style={{ width: '100%', fontSize: 13, padding: '10px' }}>
                      <ShoppingBag size={14} /> Add to Cart
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
