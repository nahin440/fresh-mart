import ProductForm from '@/components/admin/ProductForm';
export default function AddProductPage() {
  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Add New Product</h1>
        <p style={{ fontSize: 14, color: 'var(--slate)' }}>Fill in the details below to add a new product to your catalogue.</p>
      </div>
      <ProductForm mode="add" />
    </div>
  );
}
