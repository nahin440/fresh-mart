'use client';
import { useState, useEffect } from 'react';
import { useParams }           from 'next/navigation';
import ProductForm             from '@/components/admin/ProductForm';
import productsData            from '@/lib/products.json';

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProd] = useState(null);
  const [loading, setLoad] = useState(true);

  useEffect(()=>{
    fetch(`/api/products/${id}`)
      .then(r=>r.json())
      .then(d=>{ setProd({ ...d.product, id:(d.product.id||d.product._id)?.toString() }); setLoad(false); })
      .catch(()=>{ const p=productsData.find(p=>p.id===id); setProd(p||null); setLoad(false); });
  },[id]);

  if (loading) return (
    <div style={{ padding:'2rem', maxWidth:860 }}>
      {[...Array(5)].map((_,i)=><div key={i} className="skeleton admin-card" style={{ height:120, borderRadius:16, marginBottom:'1rem' }}/>)}
    </div>
  );

  if (!product) return <div style={{ padding:'2rem' }}><p style={{color:'var(--slate)'}}>Product not found.</p></div>;

  return (
    <div style={{ padding:'clamp(1.5rem,4vw,2.5rem)', maxWidth:860 }}>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'clamp(1.5rem,3vw,2rem)',fontWeight:800,letterSpacing:'-0.03em',marginBottom:'0.375rem' }}>Edit Product</h1>
        <p style={{ color:'var(--slate)',fontSize:'0.9375rem' }}>Editing: <strong>{product.name}</strong></p>
      </div>
      <ProductForm mode="edit" productId={id} initial={product}/>
    </div>
  );
}
