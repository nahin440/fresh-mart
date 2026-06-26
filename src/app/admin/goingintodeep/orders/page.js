'use client';
import { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp, Search } from 'lucide-react';

const STATUS = {
  pending:    { label: 'Pending',    bg: '#fef3c7', color: '#92400e' },
  confirmed:  { label: 'Confirmed',  bg: '#dbeafe', color: '#1e40af' },
  preparing:  { label: 'Preparing',  bg: '#ede9fe', color: '#7c3aed' },
  dispatched: { label: 'Dispatched', bg: '#d1fae5', color: '#065f46' },
  delivered:  { label: 'Delivered',  bg: '#d1fae5', color: '#059669' },
  cancelled:  { label: 'Cancelled',  bg: '#fee2e2', color: '#991b1b' },
};

const ALL_STATUS = Object.keys(STATUS);

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      await fetch(`/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
      setOrders(os => os.map(o => (o._id === id || o.orderNumber === id) ? { ...o, status: newStatus } : o));
    } catch { alert('Could not update — MongoDB may not be connected.'); }
    setUpdating(null);
  };

  const filtered = orders.filter(o => {
    const matchS = !search || o.orderNumber?.toLowerCase().includes(search.toLowerCase()) || o.customer?.name?.toLowerCase().includes(search.toLowerCase());
    const matchF = statusFilter === 'all' || o.status === statusFilter;
    return matchS && matchF;
  });

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Orders</h1>
        <p style={{ fontSize: 14, color: 'var(--slate)' }}>{orders.length} total orders</p>
      </div>

      {/* Status chips */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        <button onClick={() => setStatusFilter('all')} className={`filter-chip${statusFilter === 'all' ? ' active' : ''}`}>
          All ({orders.length})
        </button>
        {ALL_STATUS.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`filter-chip${statusFilter === s ? ' active' : ''}`}>
            {STATUS[s].label} ({orders.filter(o => o.status === s).length})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="admin-card" style={{ padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Search size={15} style={{ color: 'var(--slate)', flexShrink: 0 }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by order number or customer name..."
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, fontFamily: 'inherit', color: 'var(--ink)', background: 'transparent' }} />
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton admin-card" style={{ height: 70 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-card" style={{ padding: 48, textAlign: 'center' }}>
          <Package size={40} style={{ color: 'var(--concrete)', margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--slate)', fontSize: 14 }}>No orders found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(order => {
            const id = order._id || order.orderNumber;
            const s = STATUS[order.status] || STATUS.pending;
            const isExpanded = expanded === id;

            return (
              <div key={id} className="admin-card" style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', cursor: 'pointer' }}
                  onClick={() => setExpanded(isExpanded ? null : id)}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                      <p style={{ fontSize: 14, fontWeight: 700 }}>{order.orderNumber}</p>
                      <span style={{ fontSize: 10, padding: '2px 9px', borderRadius: 99, background: s.bg, color: s.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>
                        {s.label}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--slate)' }}>{order.customer?.name} · {order.customer?.phone}</p>
                  </div>

                  <div style={{ textAlign: 'center', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{order.items?.length || 0}</p>
                    <p style={{ fontSize: 10, color: 'var(--slate)' }}>items</p>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 16, fontWeight: 800 }}>£{order.total?.toFixed(2)}</p>
                    <p style={{ fontSize: 11, color: 'var(--slate)' }}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : '—'}</p>
                  </div>

                  <div onClick={e => e.stopPropagation()} style={{ flexShrink: 0 }}>
                    <select value={order.status} disabled={updating === id}
                      onChange={e => updateStatus(id, e.target.value)}
                      style={{ appearance: 'none', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-pill)', background: '#fff', padding: '6px 12px', fontSize: 12, outline: 'none', cursor: 'pointer', fontFamily: 'inherit', minWidth: 110 }}>
                      {ALL_STATUS.map(s => <option key={s} value={s}>{STATUS[s].label}</option>)}
                    </select>
                  </div>

                  {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--slate)', flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: 'var(--slate)', flexShrink: 0 }} />}
                </div>

                {isExpanded && (
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--hairline)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="anim-fade-in">
                    <div style={{ paddingTop: 16 }}>
                      <p style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', fontWeight: 600, marginBottom: 8 }}>Delivery Address</p>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>{order.customer?.name}</p>
                      <p style={{ fontSize: 13, color: 'var(--ash)', lineHeight: 1.6 }}>{order.customer?.address}</p>
                      <p style={{ fontSize: 13, color: 'var(--ash)' }}>{order.customer?.city} {order.customer?.postcode}</p>
                      <p style={{ fontSize: 13, color: 'var(--ash)' }}>{order.customer?.phone}</p>
                      {order.customer?.email && <p style={{ fontSize: 13, color: 'var(--ash)' }}>{order.customer.email}</p>}
                      {order.customer?.notes && <p style={{ fontSize: 12, color: 'var(--slate)', marginTop: 6, fontStyle: 'italic' }}>Note: {order.customer.notes}</p>}
                    </div>
                    <div style={{ paddingTop: 16 }}>
                      <p style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)', fontWeight: 600, marginBottom: 8 }}>Items Ordered</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {order.items?.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {item.image && (
                              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--canvas)', flexShrink: 0 }}>
                                <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                              <p style={{ fontSize: 11, color: 'var(--slate)' }}>Qty: {item.quantity}</p>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, flexShrink: 0 }}>£{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--hairline)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {[['Subtotal', `£${order.subtotal?.toFixed(2)}`], ['Delivery', order.deliveryFee === 0 ? 'Free' : `£${order.deliveryFee?.toFixed(2)}`], ['Total', `£${order.total?.toFixed(2)}`]].map(([l, v]) => (
                          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: l === 'Total' ? 14 : 12 }}>
                            <span style={{ color: 'var(--slate)' }}>{l}</span>
                            <span style={{ fontWeight: l === 'Total' ? 700 : 400 }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <style jsx>{`
        div[style*='1fr 1fr']:last-of-type { }
        @media (max-width: 640px) {
          div[style*='1fr 1fr'] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
