'use client';
import { useCart } from '@/context/CartContext';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, total, count } = useCart();
  const deliveryFee = total >= 50 ? 0 : 3.99;
  const progress = Math.min((total / 50) * 100, 100);

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsOpen(false)} />
      <div className="cart-drawer">
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingBag size={18} />
            <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>Your Cart</span>
            {count > 0 && (
              <span style={{ background: 'var(--violet)', color: '#fff', borderRadius: 99, padding: '1px 8px', fontSize: 11, fontWeight: 700 }}>{count}</span>
            )}
          </div>
          <button onClick={() => setIsOpen(false)}
            style={{ width: 32, height: 32, borderRadius: 99, border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fff', transition: 'all 0.15s' }}
            className="hover:bg-[var(--canvas)]">
            <X size={16} />
          </button>
        </div>

        {/* Free delivery progress */}
        {total < 50 && total > 0 && (
          <div style={{ padding: '12px 24px', background: 'var(--canvas)', borderBottom: '1px solid var(--hairline)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, letterSpacing: '-0.031em', color: 'var(--slate)' }}>
              <span>Add <strong style={{ color: 'var(--ink)' }}>£{(50 - total).toFixed(2)}</strong> for free delivery</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: items.length ? '16px 24px' : 0 }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 40, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-img)', background: 'var(--canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={28} style={{ color: 'var(--concrete)' }} />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 16, letterSpacing: '-0.02em', marginBottom: 6 }}>Your cart is empty</p>
                <p style={{ fontSize: 13, color: 'var(--slate)' }}>Add items to get started</p>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <Link href="/products" onClick={() => setIsOpen(false)} className="btn-violet" style={{ fontSize: 13 }}>Browse Products</Link>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--hairline)' }}
                  className="anim-fade-up last:border-0">
                  <Link href={`/products/${item.id}`} onClick={() => setIsOpen(false)}
                    style={{ width: 72, height: 72, borderRadius: 'var(--radius-img)', overflow: 'hidden', flexShrink: 0, background: 'var(--canvas)', display: 'block' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/products/${item.id}`} onClick={() => setIsOpen(false)}
                      style={{ fontSize: 13, letterSpacing: '-0.023em', color: 'var(--ink)', textDecoration: 'none', display: 'block', marginBottom: 2, fontWeight: 500 }}
                      className="hover:text-[var(--violet)] transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <p style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 8 }}>{item.unit}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}
                          style={{ opacity: item.quantity <= 1 ? 0.3 : 1 }}>
                          <Minus size={12} />
                        </button>
                        <span className="qty-num" style={{ fontSize: 13, fontWeight: 600 }}>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={12} />
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>£{(item.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.id)}
                          style={{ color: 'var(--concrete)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', transition: 'color 0.15s' }}
                          className="hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--hairline)', flexShrink: 0, background: '#fff' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {[
                ['Subtotal', `£${total.toFixed(2)}`],
                ['Delivery', deliveryFee === 0 ? '🎉 Free' : `£${deliveryFee.toFixed(2)}`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, letterSpacing: '-0.023em' }}>
                  <span style={{ color: 'var(--slate)' }}>{label}</span>
                  <span style={{ fontWeight: 500, color: deliveryFee === 0 && label === 'Delivery' ? 'var(--accent-green)' : 'var(--ink)' }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', paddingTop: 10, borderTop: '1px solid var(--hairline)' }}>
                <span>Total</span>
                <span>£{(total + deliveryFee).toFixed(2)}</span>
              </div>
            </div>
            <Link href="/checkout" onClick={() => setIsOpen(false)} className="btn-violet" style={{ width: '100%', fontSize: 14, padding: '14px' }}>
              Checkout <ArrowRight size={16} />
            </Link>
            <button onClick={() => setIsOpen(false)} className="btn-ghost" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
