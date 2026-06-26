import Link from 'next/link';
export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 24px' }}>
      <p style={{ fontSize: 120, fontWeight: 800, letterSpacing: '-0.08em', color: 'var(--hairline)', lineHeight: 1, marginBottom: 16 }}>404</p>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 12 }}>Page Not Found</h1>
      <p style={{ fontSize: 15, color: 'var(--slate)', marginBottom: 32, maxWidth: 360 }}>The page you're looking for doesn't exist or has been moved.</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link href="/" className="btn-violet" style={{ fontSize: 14 }}>Go Home</Link>
        <Link href="/products" className="btn-outline" style={{ fontSize: 14 }}>Shop Products</Link>
      </div>
    </div>
  );
}
