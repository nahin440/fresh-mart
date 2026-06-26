'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Truck, CreditCard, CheckCircle, ArrowRight, Leaf } from 'lucide-react';
import Link from 'next/link';

const STEPS = ['Delivery', 'Review', 'Placed'];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderNum, setOrderNum] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', postcode: '', notes: '' });
  const [errors, setErrors] = useState({});

  const deliveryFee = total >= 50 ? 0 : 3.99;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.postcode.trim()) e.postcode = 'Required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (step === 0) { if (!validate()) return; setStep(1); window.scrollTo(0,0); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form, items: items.map(i => ({ productId: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
          subtotal: total, deliveryFee, total: total + deliveryFee, paymentMethod: 'cod',
        }),
      });
      const data = await res.json();
      setOrderNum(data.orderNumber || 'FM' + Date.now().toString().slice(-8));
    } catch { setOrderNum('FM' + Date.now().toString().slice(-8)); }
    clearCart();
    setStep(2);
    setLoading(false);
    window.scrollTo(0, 0);
  };

  if (items.length === 0 && step !== 2) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Your cart is empty</h1>
      <Link href="/products" className="btn-violet" style={{ fontSize: 14 }}>Start Shopping</Link>
    </div>
  );

  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh', padding: '40px 0' }}>
      <div className="page-container" style={{ maxWidth: 900 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ background: 'var(--accent-green)', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={14} color="#fff" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--ink)' }}>FRESHMART</span>
          </Link>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40, gap: 0 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div className="step-dot"
                  style={{ background: i < step ? 'var(--accent-green)' : i === step ? 'var(--violet)' : 'var(--hairline)', color: i <= step ? '#fff' : 'var(--slate)' }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 11, color: i === step ? 'var(--ink)' : 'var(--slate)', fontWeight: i === step ? 600 : 400 }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="step-line" style={{ width: 64, background: i < step ? 'var(--accent-green)' : 'var(--hairline)', marginBottom: 20, marginLeft: -1, marginRight: -1 }} />
              )}
            </div>
          ))}
        </div>

        {step === 2 ? (
          <div style={{ background: '#fff', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)', padding: 48, textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
            <div style={{ width: 64, height: 64, background: 'var(--accent-green-pale)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={32} style={{ color: 'var(--accent-green)' }} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>Order Placed!</h1>
            <p style={{ fontSize: 14, color: 'var(--slate)', marginBottom: 6 }}>Thank you, {form.name}!</p>
            <div style={{ background: 'var(--canvas)', borderRadius: 'var(--radius-sm)', padding: '12px 20px', display: 'inline-block', marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: 'var(--slate)' }}>Order #</span>
              <span style={{ fontSize: 16, fontWeight: 700, marginLeft: 6, letterSpacing: '-0.02em' }}>{orderNum}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.7, marginBottom: 28 }}>
              We're preparing your order for delivery to {form.address}, {form.city}. You'll receive updates soon.
            </p>
            <Link href="/" className="btn-violet" style={{ display: 'inline-flex', fontSize: 14 }}>
              Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
            {/* Form */}
            <div style={{ background: '#fff', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)', padding: 32 }}>
              {step === 0 && (
                <>
                  <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Truck size={18} style={{ color: 'var(--violet)' }} /> Delivery Details
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[
                      { n: 'name', l: 'Full Name', ph: 'Jane Smith', req: true, full: true },
                      { n: 'email', l: 'Email (optional)', ph: 'jane@example.com', type: 'email', full: true },
                      { n: 'phone', l: 'Phone Number', ph: '+44 7700 900000', req: true },
                      { n: 'postcode', l: 'Postcode', ph: 'SW1A 1AA', req: true },
                      { n: 'address', l: 'Street Address', ph: '12 High Street', req: true, full: true },
                      { n: 'city', l: 'City', ph: 'London', req: true },
                    ].map(f => (
                      <div key={f.n} style={{ gridColumn: f.full ? '1 / -1' : 'auto' }}>
                        <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6, fontWeight: 600 }}>
                          {f.l}{f.req && <span style={{ color: '#ef4444' }}> *</span>}
                        </label>
                        <input type={f.type || 'text'} value={form[f.n]} onChange={e => setForm(p => ({ ...p, [f.n]: e.target.value }))}
                          placeholder={f.ph} className="input-field"
                          style={{ borderColor: errors[f.n] ? '#ef4444' : undefined }} />
                        {errors[f.n] && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors[f.n]}</p>}
                      </div>
                    ))}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6, fontWeight: 600 }}>Delivery Notes</label>
                      <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                        placeholder="Leave by the door / Ring bell 2..." rows={3}
                        className="input-field" style={{ resize: 'none' }} />
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CreditCard size={18} style={{ color: 'var(--violet)' }} /> Review Order
                  </h2>
                  <div style={{ borderBottom: '1px solid var(--hairline)', marginBottom: 20, paddingBottom: 20 }}>
                    {items.map(item => (
                      <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--canvas)', flexShrink: 0 }}>
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                          <p style={{ fontSize: 12, color: 'var(--slate)' }}>Qty: {item.quantity}</p>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, flexShrink: 0 }}>£{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'var(--canvas)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginBottom: 20 }}>
                    <p style={{ fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 8, fontWeight: 600 }}>Delivering to</p>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{form.name}</p>
                    <p style={{ fontSize: 13, color: 'var(--slate)' }}>{form.address}, {form.city}, {form.postcode}</p>
                    <p style={{ fontSize: 13, color: 'var(--slate)' }}>{form.phone}</p>
                  </div>
                  <div style={{ background: 'var(--canvas)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
                    <p style={{ fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 8, fontWeight: 600 }}>Payment</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--violet)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>Cash on Delivery</span>
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)} className="btn-outline" style={{ flex: 1, fontSize: 14 }}>Back</button>
                )}
                <button onClick={handleNext} disabled={loading} className="btn-violet" style={{ flex: 2, fontSize: 15, padding: '14px', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Placing Order...' : step === 0 ? 'Continue to Review' : 'Place Order'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </div>
            </div>

            {/* Order summary */}
            <div style={{ background: '#fff', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)', padding: 24, position: 'sticky', top: 88 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 16 }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, maxHeight: 240, overflowY: 'auto' }}>
                {items.map(i => (
                  <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--slate)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8 }}>{i.name} ×{i.quantity}</span>
                    <span style={{ flexShrink: 0 }}>£{(i.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {[['Subtotal', `£${total.toFixed(2)}`], ['Delivery', deliveryFee === 0 ? 'Free' : `£${deliveryFee.toFixed(2)}`]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: 'var(--slate)' }}>{l}</span>
                  <span style={{ color: deliveryFee === 0 && l === 'Delivery' ? 'var(--accent-green)' : 'var(--ink)', fontWeight: deliveryFee === 0 && l === 'Delivery' ? 600 : 400 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 800, borderTop: '1px solid var(--hairline)', paddingTop: 14, marginTop: 8 }}>
                <span>Total</span><span>£{(total + deliveryFee).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*='340px'] { grid-template-columns: 1fr !important; }
          div[style*='1fr 1fr'] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
