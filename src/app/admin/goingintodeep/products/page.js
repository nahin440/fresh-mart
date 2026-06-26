'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, Search, Eye, Leaf, Zap } from 'lucide-react';
import productsData from '@/lib/products.json';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => { setProducts((d.products || []).map(p => ({ ...p, id: (p.id || p._id)?.toString() }))); setLoading(false); })
      .catch(() => { setProducts(productsData); setLoading(false); });
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) setProducts(ps => ps.filter(p => p.id !== id));
      else alert('Delete failed — MongoDB may not be connected.');
    } catch { alert('Could not delete.'); }
    setDeleting(null);
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Products</h1>
          <p style={{ fontSize: 14, color: 'var(--slate)' }}>{products.length} total products in catalogue</p>
        </div>
        <Link href="/admin/goingintodeep/add-product"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--violet)', color: '#fff', borderRadius: 'var(--radius-pill)', padding: '10px 20px', fontSize: 13, fontWeight: 600, textDecoration: 'none', boxShadow: 'var(--shadow-violet)', transition: 'opacity 0.15s' }}>
          <Plus size={15} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="admin-card" style={{ padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Search size={15} style={{ color: 'var(--slate)', flexShrink: 0 }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or category..."
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, fontFamily: 'inherit', color: 'var(--ink)', background: 'transparent' }} />
        {search && <button onClick={() => setSearch('')} style={{ fontSize: 12, color: 'var(--slate)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>}
      </div>

      {/* Table */}
      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 700 }}>
            <thead>
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Labels', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 16, borderRadius: 4 }} /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--slate)' }}>No products found</td></tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--canvas)', flexShrink: 0 }}>
                          <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{p.name}</p>
                          <p style={{ fontSize: 11, color: 'var(--slate)' }}>{p.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--slate)', fontSize: 12 }}>{p.category}</td>
                    <td>
                      <p style={{ fontSize: 14, fontWeight: 700 }}>£{p.price.toFixed(2)}</p>
                      {p.originalPrice && <p style={{ fontSize: 11, color: 'var(--slate)', textDecoration: 'line-through' }}>£{p.originalPrice.toFixed(2)}</p>}
                    </td>
                    <td>
                      <span style={{ fontSize: 13, fontWeight: 600, color: p.stock < 10 ? '#ef4444' : p.stock < 20 ? '#f59e0b' : 'var(--accent-green)' }}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {p.isFlashSale && <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 99, background: '#fee2e2', color: '#991b1b', fontWeight: 700, textTransform: 'uppercase' }}>SALE</span>}
                        {p.isNewArrival && <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 99, background: 'rgba(84,51,235,0.1)', color: 'var(--violet)', fontWeight: 700, textTransform: 'uppercase' }}>NEW</span>}
                        {p.isBestSeller && <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 99, background: 'var(--canvas)', color: 'var(--ink)', fontWeight: 700, textTransform: 'uppercase' }}>BEST</span>}
                        {p.isOrganic && <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 99, background: 'var(--accent-green-pale)', color: 'var(--accent-green)', fontWeight: 700, textTransform: 'uppercase' }}>ORG</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[
                          { href: `/products/${p.id}`, icon: Eye, title: 'View', color: 'var(--slate)' },
                          { href: `/admin/goingintodeep/edit-product/${p.id}`, icon: Edit, title: 'Edit', color: 'var(--violet)' },
                        ].map(({ href, icon: Icon, title, color }) => (
                          <Link key={href} href={href} title={title}
                            style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', color, textDecoration: 'none', transition: 'all 0.15s', background: '#fff' }}>
                            <Icon size={13} />
                          </Link>
                        ))}
                        <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} title="Delete"
                          style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: deleting === p.id ? 'var(--concrete)' : '#ef4444', cursor: 'pointer', transition: 'all 0.15s', background: '#fff' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
