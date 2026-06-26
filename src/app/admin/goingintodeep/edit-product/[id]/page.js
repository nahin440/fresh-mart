'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import productsData from '@/lib/products.json';

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(d => { setProduct({ ...d.product, id: (d.product.id || d.product._id)?.toString() }); setLoading(false); })
      .catch(() => {
        const p = productsData.find(p => p.id === id);
        setProduct(p || null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-sm)' }} />)}
      </div>
    </div>
  );

  if (!product) return (
    <div style={{ padding: 32 }}>
      <p style={{ color: 'var(--slate)' }}>Product not found.</p>
    </div>
  );

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Edit Product</h1>
        <p style={{ fontSize: 14, color: 'var(--slate)' }}>Editing: <strong>{product.name}</strong></p>
      </div>
      <ProductForm mode="edit" productId={id} initial={product} />
    </div>
  );
}
