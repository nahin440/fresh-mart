export function ProductSkeleton() {
  return (
    <div style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
      <div className="skeleton" style={{ aspectRatio: '1/1' }} />
      <div style={{ padding: 12 }}>
        <div className="skeleton" style={{ height: 10, width: '40%', marginBottom: 8, borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 6, borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 12, borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 20, width: '35%', borderRadius: 4 }} />
      </div>
    </div>
  );
}
export function ProductSkeletonGrid({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => <ProductSkeleton key={i} />)}
    </div>
  );
}
