import Link from 'next/link';
export default function NotFound() {
  return (
    <div style={{ minHeight:'70vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'3rem 1.5rem',background:'var(--off-white)' }}>
      <div style={{ fontSize:'clamp(6rem,20vw,10rem)',fontWeight:900,letterSpacing:'-0.06em',color:'var(--hairline)',lineHeight:1,marginBottom:'1.5rem',userSelect:'none' }}>404</div>
      <h1 className="t-h1" style={{ marginBottom:'0.875rem' }}>Page Not Found</h1>
      <p className="t-body" style={{ maxWidth:360,marginBottom:'2.5rem' }}>The page you're looking for doesn't exist or has been moved.</p>
      <div style={{ display:'flex',gap:'0.875rem',flexWrap:'wrap',justifyContent:'center' }}>
        <Link href="/" className="btn btn-primary btn-lg">Go Home</Link>
        <Link href="/products" className="btn btn-outline btn-lg">Shop Products</Link>
      </div>
    </div>
  );
}
