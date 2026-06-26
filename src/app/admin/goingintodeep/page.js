'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, TrendingUp, Star, ArrowUpRight, Plus, Eye } from 'lucide-react';
import productsData from '@/lib/products.json';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pending = orders.filter(o => o.status === 'pending').length;
  const lowStock = productsData.filter(p => p.stock < 15).length;
  const avgRating = (productsData.reduce((s, p) => s + p.rating, 0) / productsData.length).toFixed(1);

  const stats = [
    { label: 'Total Products', value: productsData.length, icon: Package, color: '#5433eb', bg: 'rgba(84,51,235,0.1)', sub: `${lowStock} low stock` },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', sub: `${pending} pending` },
    { label: 'Revenue', value: `£${revenue.toFixed(2)}`, icon: TrendingUp, color: '#10b981', bg: 'rgba(16,185,129,0.1)', sub: 'All time' },
    { label: 'Avg Rating', value: avgRating, icon: Star, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', sub: 'Across all products' },
  ];

  const STATUS_COLORS = {
    pending: { bg: '#fef3c7', color: '#92400e' },
    confirmed: { bg: '#dbeafe', color: '#1e40af' },
    preparing: { bg: '#ede9fe', color: '#7c3aed' },
    dispatched: { bg: '#d1fae5', color: '#065f46' },
    delivered: { bg: '#d1fae5', color: '#059669' },
    cancelled: { bg: '#fee2e2', color: '#991b1b' },
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: 14, color: 'var(--slate)' }}>Welcome back. Here's what's happening with FreshMart.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {stats.map(({ label, value, icon: Icon, color, bg, sub }) => (
          <div key={label} className="admin-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} style={{ color }} />
              </div>
              <ArrowUpRight size={14} style={{ color: 'var(--concrete)' }} />
            </div>
            <p style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 2 }}>{value}</p>
            <p style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500, marginBottom: 3 }}>{label}</p>
            <p style={{ fontSize: 11, color: 'var(--slate)' }}>{sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent Orders */}
        <div className="admin-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>Recent Orders</h2>
            <Link href="/admin/goingintodeep/orders" style={{ fontSize: 12, color: 'var(--violet)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 48, borderRadius: 6 }} />)}
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--slate)', fontSize: 13 }}>No orders yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {orders.slice(0, 5).map(o => {
                const s = STATUS_COLORS[o.status] || STATUS_COLORS.pending;
                return (
                  <div key={o._id || o.orderNumber} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--hairline)' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{o.orderNumber}</p>
                      <p style={{ fontSize: 11, color: 'var(--slate)' }}>{o.customer?.name}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 99, background: s.bg, color: s.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{o.status}</span>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>£{o.total?.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="admin-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>Top Products</h2>
            <Link href="/admin/goingintodeep/products" style={{ fontSize: 12, color: 'var(--violet)', textDecoration: 'none' }}>Manage →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[...productsData].sort((a,b) => b.reviews - a.reviews).slice(0, 5).map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--hairline)' }}>
                <span style={{ fontSize: 11, color: 'var(--concrete)', width: 16, textAlign: 'center', flexShrink: 0 }}>{i+1}</span>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, background: 'var(--canvas)' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--slate)' }}>{p.reviews} reviews · ★{p.rating}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, flexShrink: 0 }}>£{p.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 20 }}>
        {[
          { label: 'Add Product', href: '/admin/goingintodeep/add-product', icon: Plus, desc: 'List a new item' },
          { label: 'All Products', href: '/admin/goingintodeep/products', icon: Package, desc: 'Edit catalogue' },
          { label: 'View Orders', href: '/admin/goingintodeep/orders', icon: ShoppingCart, desc: 'Manage orders' },
          { label: 'View Store', href: '/', icon: Eye, desc: 'Front end preview' },
        ].map(({ label, href, icon: Icon, desc }) => (
          <Link key={href} href={href}
            style={{ display: 'block', textDecoration: 'none', padding: '16px 18px', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)', background: '#fff', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet)'; e.currentTarget.style.background = 'rgba(84,51,235,0.03)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--hairline)'; e.currentTarget.style.background = '#fff'; }}>
            <Icon size={16} style={{ color: 'var(--violet)', marginBottom: 8 }} />
            <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 3 }}>{label}</p>
            <p style={{ fontSize: 12, color: 'var(--slate)' }}>{desc}</p>
          </Link>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          div[style*='repeat(4,1fr)']:first-of-type { grid-template-columns: repeat(2,1fr) !important; }
          div[style*='1fr 1fr'] { grid-template-columns: 1fr !important; }
          div[style*='repeat(4,1fr)']:last-of-type { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
