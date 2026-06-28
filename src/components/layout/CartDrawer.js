'use client';
import { useCart } from '@/context/CartContext';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Gift } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, total, count } = useCart();
  const deliveryFee = total >= 50 ? 0 : 3.99;
  const progress = Math.min((total / 50) * 100, 100);

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={() => setIsOpen(false)} />
      <div className="drawer">
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingBag size={19} />
            <span style={{ fontWeight: 700, fontSize: '1.0625rem', letterSpacing: '-0.025em' }}>Your Cart</span>
            {count > 0 && (
              <span style={{ background: 'var(--violet)', color: '#fff', borderRadius: 99, padding: '1px 9px', fontSize: '0.75rem', fontWeight: 800 }}>{count}</span>
            )}
          </div>
          <button className="btn btn-ghost btn-icon" onClick={() => setIsOpen(false)} style={{ border: '1px solid var(--hairline)' }}>
            <X size={17} />
          </button>
        </div>

        {/* Free delivery progress */}
        {count > 0 && (
          <div style={{ padding: '0.875rem 1.5rem', background: total >= 50 ? 'var(--green-pale)' : 'var(--off-white)', borderBottom: '1px solid var(--hairline)', flexShrink: 0 }}>
            {total >= 50 ? (
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Gift size={14} /> 🎉 You've unlocked free delivery!
              </p>
            ) : (
              <>
                <p style={{ fontSize: '0.8125rem', color: 'var(--slate)', marginBottom: '0.5rem' }}>
                  Add <strong style={{ color: 'var(--ink)' }}>£{(50 - total).toFixed(2)}</strong> more for free delivery
                </p>
                <div className="progress">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </>
            )}
          </div>
        )}

        {/* Items */}
        <div className="scroll-area" style={{ flex: 1, padding: count ? '1rem 1.5rem' : 0 }}>
          {count === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '3rem 2rem', textAlign: 'center', gap: '1rem' }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={30} style={{ color: 'var(--muted)' }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.375rem', letterSpacing: '-0.02em' }}>Your cart is empty</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate)', lineHeight: 1.6 }}>Add items to get started</p>
              </div>
              <Link href="/products" onClick={() => setIsOpen(false)} className="btn btn-primary btn-sm">
                Browse Products <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '0.875rem', padding: '1rem 0', borderBottom: '1px solid var(--hairline)' }} className="afu">
                  <Link href={`/products/${item.id}`} onClick={() => setIsOpen(false)}
                    style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: 'var(--canvas)', display: 'block' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.07)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/products/${item.id}`} onClick={() => setIsOpen(false)}
                      style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: '0.1875rem', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.target.style.color = 'var(--violet)'}
                      onMouseLeave={e => e.target.style.color = 'var(--ink)'}>
                      {item.name}
                    </Link>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.625rem' }}>{item.unit}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="qty-ctrl">
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} style={{ opacity: item.quantity <= 1 ? 0.3 : 1 }}>
                          <Minus size={12} />
                        </button>
                        <span className="qty-num" style={{ fontSize: '0.875rem' }}>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={12} />
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>£{(item.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', transition: 'color 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#e74c3c'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
                          <Trash2 size={15} />
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
        {count > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--hairline)', flexShrink: 0, background: '#fff' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.125rem' }}>
              {[['Subtotal', `£${total.toFixed(2)}`], ['Delivery', deliveryFee === 0 ? '🎉 Free' : `£${deliveryFee.toFixed(2)}`]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--slate)' }}>{l}</span>
                  <span style={{ fontWeight: 600, color: deliveryFee === 0 && l === 'Delivery' ? 'var(--green)' : 'var(--ink)' }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.0625rem', fontWeight: 800, letterSpacing: '-0.025em', paddingTop: '0.75rem', borderTop: '1px solid var(--hairline)' }}>
                <span>Total</span>
                <span>£{(total + deliveryFee).toFixed(2)}</span>
              </div>
            </div>
            <Link href="/checkout" onClick={() => setIsOpen(false)} className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.9375rem', padding: '0.9375rem' }}>
              Checkout <ArrowRight size={17} />
            </Link>
            <button className="btn btn-ghost" onClick={() => setIsOpen(false)}
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.375rem', fontSize: '0.875rem' }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
