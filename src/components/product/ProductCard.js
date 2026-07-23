'use client';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Leaf, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const id = product.id || product._id?.toString();
  const wishlisted = isWishlisted(id);

  return (
    <div className="card afu" style={{ animationDelay: `${index * 0.07}s` }}>
      {/* Image */}
      <div className="prod-img" style={{ position: 'relative' }}>
        <Link href={`/products/${id}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>

        {/* Badges */}
        <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {product.isFlashSale && <span className="tag tag-red"><Zap size={9} fill="currentColor" />-{product.discount}%</span>}
          {!product.isFlashSale && product.isNewArrival && <span className="tag tag-violet">NEW</span>}
          {product.isOrganic && <span className="tag tag-green"><Leaf size={9} />ORG</span>}
        </div>

        {/* Wishlist */}
        <button className="wish-btn" onClick={() => toggle({ ...product, id })} aria-label="Wishlist"
          style={{ color: wishlisted ? '#e74c3c' : 'var(--ink)', background: wishlisted ? '#fee' : 'rgba(255,255,255,0.92)' }}>
          <Heart size={13} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick add */}
        <div className="prod-actions">
          <button onClick={() => addToCart({ ...product, id })}
            className="btn btn-white btn-sm"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem', borderRadius: 100 }}>
            <ShoppingBag size={13} /> Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: 'clamp(0.625rem, 2vw, 0.875rem)' }}>
        <p className="t-label" style={{ color: 'var(--muted)', marginBottom: '0.25rem' }}>{product.subcategory || product.category}</p>
        <Link href={`/products/${id}`}>
          <h3 style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.9375rem)', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4, transition: 'color 0.15s' }}
            onMouseEnter={e => e.target.style.color = 'var(--violet)'}
            onMouseLeave={e => e.target.style.color = 'var(--ink)'}>
            {product.name}
          </h3>
        </Link>
        <p className="t-small" style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>{product.unit}</p>

        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.625rem' }}>
          <div className="stars">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={10}
                fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'}
                style={{ color: s <= Math.round(product.rating) ? '#f59e0b' : '#ddd' }} />
            ))}
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>({product.reviews})</span>
        </div>

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.25rem' }}>
          <div>
            <span className="t-price">৳{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textDecoration: 'line-through', marginLeft: '0.375rem' }}>
                ৳{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button onClick={() => addToCart({ ...product, id })}
            style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ink)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--violet)'; e.currentTarget.style.transform = 'scale(1.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.transform = 'scale(1)'; }}>
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
