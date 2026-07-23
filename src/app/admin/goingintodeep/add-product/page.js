import ProductForm from '@/components/admin/ProductForm';
export default function AddProductPage() {
  return (
    <div style={{ padding:'clamp(1.5rem,4vw,2.5rem)', maxWidth:860 }}>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'clamp(1.5rem,3vw,2rem)',fontWeight:800,letterSpacing:'-0.03em',marginBottom:'0.375rem' }}>Add New Product</h1>
        <p style={{ color:'var(--slate)',fontSize:'0.9375rem' }}>Fill in the details below to list a new product in your catalogue.</p>
      </div>
      <ProductForm mode="add"/>
    </div>
  );
}
