'use client';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Leaf, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

function StarRow({ rating, reviews }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div className="stars">
        {[1,2,3,4,5].map(s => (
          <Star key={s} size={10} fill={s <= Math.round(rating) ? '#f59e0b' : 'none'}
            style={{ color: s <= Math.round(rating) ? '#f59e0b' : 'var(--concrete)' }} />
        ))}
      </div>
      <span className="text-9" style={{ color: 'var(--slate)' }}>({reviews})</span>
    </div>
  );
}

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id || product._id?.toString());

  const id = product.id || product._id?.toString();

  return (
    <div className="card anim-fade-up" style={{ animationDelay: `${index * 0.06}s` }}>
      {/* Image */}
      <div className="prod-img-wrap" style={{ position: 'relative' }}>
        <Link href={`/products/${id}`} tabIndex={-1}>
          <img src={product.image} alt={product.name} loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Link>

        {/* Badges */}
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {product.isFlashSale && (
            <span className="tag tag-red" style={{ fontSize: 10 }}>
              <Zap size={9} fill="currentColor" /> -{product.discount}%
            </span>
          )}
          {product.isNewArrival && !product.isFlashSale && (
            <span className="tag tag-violet" style={{ fontSize: 10 }}>NEW</span>
          )}
          {product.isOrganic && (
            <span className="tag tag-green" style={{ fontSize: 10 }}>
              <Leaf size={9} />ORG
            </span>
          )}
          {product.isBestSeller && !product.isFlashSale && !product.isNewArrival && (
            <span className="tag tag-dark" style={{ fontSize: 10 }}>⭐ BEST</span>
          )}
        </div>

        {/* Wishlist */}
        <button onClick={() => toggle({ ...product, id })}
          style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0, transition: 'all 0.2s', color: wishlisted ? '#ef4444' : 'var(--slate)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
          className="wishlist-btn"
          aria-label="Add to wishlist">
          <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick add overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8, opacity: 0, transform: 'translateY(8px)', transition: 'all 0.25s ease' }}
          className="quick-add">
          <button onClick={() => addToCart({ ...product, id })}
            className="btn-violet" style={{ width: '100%', fontSize: 12, padding: '9px 12px' }}>
            <ShoppingBag size={13} /> Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 12px 14px' }}>
        <p className="text-11" style={{ color: 'var(--slate)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {product.subcategory || product.category}
        </p>
        <Link href={`/products/${id}`} style={{ textDecoration: 'none' }}>
          <h3 className="text-14" style={{ color: 'var(--ink)', marginBottom: 4, fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
        </Link>
        <p className="text-11" style={{ color: 'var(--slate)', marginBottom: 6 }}>{product.unit}</p>
        <StarRow rating={product.rating} reviews={product.reviews} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>£{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-12" style={{ color: 'var(--slate)', textDecoration: 'line-through', marginLeft: 6 }}>
                £{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button onClick={() => addToCart({ ...product, id })}
            style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ink)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
            className="hover:bg-[var(--violet)] hover:scale-110 active:scale-95"
            aria-label="Add to cart">
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
