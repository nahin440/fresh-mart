'use client';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, count } = useCart();
  const deliveryFee = total >= 50 ? 0 : 3.99;

  return (
    <div style={{ minHeight: '70vh' }}>
      <div style={{ background: 'var(--canvas)', borderBottom: '1px solid var(--hairline)', padding: '32px 0' }}>
        <div className="page-container">
          <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: 6 }}>Your Basket</p>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em' }}>
            Shopping Cart {count > 0 && <span style={{ color: 'var(--slate)', fontWeight: 400, fontSize: 22 }}>({count})</span>}
          </h1>
        </div>
      </div>

      <div className="page-container" style={{ padding: '40px 24px' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-img)', background: 'var(--canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={36} style={{ color: 'var(--concrete)' }} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Your cart is empty</h2>
            <p style={{ fontSize: 14, color: 'var(--slate)' }}>Add some items to get started.</p>
            <Link href="/products" className="btn-violet" style={{ marginTop: 8, fontSize: 14 }}>Browse Products <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
            {/* Items */}
            <div>
              <div style={{ borderTop: '1px solid var(--hairline)' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 16, padding: '20px 0', borderBottom: '1px solid var(--hairline)' }} className="anim-fade-in">
                    <Link href={`/products/${item.id}`} style={{ width: 88, height: 88, flexShrink: 0, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--canvas)', display: 'block' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.07)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                    </Link>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <Link href={`/products/${item.id}`} style={{ textDecoration: 'none' }}>
                          <h3 style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 3 }}>{item.name}</h3>
                        </Link>
                        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', flexShrink: 0 }}>£{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 14 }}>{item.unit} · £{item.price.toFixed(2)} each</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="qty-control">
                          <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} style={{ opacity: item.quantity <= 1 ? 0.3 : 1 }}><Minus size={13} /></button>
                          <span className="qty-num" style={{ fontWeight: 700 }}>{item.quantity}</span>
                          <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={13} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--slate)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--slate)'}>
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <Link href="/products" style={{ fontSize: 13, color: 'var(--slate)', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--slate)'}>
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Summary */}
            <div style={{ position: 'sticky', top: 88 }}>
              <div style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)', padding: 24 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20 }}>Order Summary</h2>

                {total < 50 && (
                  <div style={{ background: 'var(--canvas)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 20 }}>
                    <p style={{ fontSize: 12, color: 'var(--slate)', marginBottom: 8 }}>
                      Add <strong style={{ color: 'var(--ink)' }}>£{(50 - total).toFixed(2)}</strong> for free delivery
                    </p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.min((total/50)*100, 100)}%` }} />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {[['Subtotal', `£${total.toFixed(2)}`], ['Delivery', deliveryFee === 0 ? '🎉 Free' : `£${deliveryFee.toFixed(2)}`]].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                      <span style={{ color: 'var(--slate)' }}>{l}</span>
                      <span style={{ fontWeight: deliveryFee === 0 && l === 'Delivery' ? 600 : 400, color: deliveryFee === 0 && l === 'Delivery' ? 'var(--accent-green)' : 'var(--ink)' }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', paddingTop: 14, borderTop: '1px solid var(--hairline)', marginTop: 4 }}>
                    <span>Total</span>
                    <span>£{(total + deliveryFee).toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="btn-violet" style={{ width: '100%', fontSize: 15, padding: '14px', display: 'flex', justifyContent: 'center' }}>
                  Checkout <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*='360px'] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
