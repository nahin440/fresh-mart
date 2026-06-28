'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, PlusCircle, ShoppingCart, Leaf, ArrowLeft } from 'lucide-react';

const NAV = [
  { label:'Dashboard',    href:'/admin/goingintodeep',              icon:LayoutDashboard },
  { label:'Products',     href:'/admin/goingintodeep/products',     icon:Package },
  { label:'Add Product',  href:'/admin/goingintodeep/add-product',  icon:PlusCircle },
  { label:'Orders',       href:'/admin/goingintodeep/orders',       icon:ShoppingCart },
];

export default function AdminLayout({ children }) {
  const path = usePathname();
  return (
    <div className="admin-wrap">
      <aside className="admin-side">
        <div style={{ padding:'1.5rem 1rem', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/" style={{ display:'flex',alignItems:'center',gap:'0.5rem',textDecoration:'none',marginBottom:'0.25rem' }}>
            <div style={{ width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,var(--green),#27ae60)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Leaf size={13} color="#fff"/>
            </div>
            <span style={{ color:'#fff',fontWeight:800,fontSize:'0.9375rem',letterSpacing:'-0.04em' }}>FRESHMART</span>
          </Link>
          <p style={{ fontSize:'0.625rem',color:'rgba(255,255,255,0.3)',letterSpacing:'0.1em',textTransform:'uppercase' }}>Admin Panel</p>
        </div>
        <nav style={{ padding:'0.75rem 0.75rem', flex:1 }}>
          {NAV.map(({ label, href, icon:Icon }) => {
            const active = href==='/admin/goingintodeep' ? path===href : path.startsWith(href);
            return (
              <Link key={href} href={href} className={`admin-nav-link${active?' active':''}`}>
                <Icon size={15}/>{label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding:'1rem 0.75rem',borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/" className="admin-nav-link" style={{ fontSize:'0.8125rem' }}>
            <ArrowLeft size={13}/> Back to Store
          </Link>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
