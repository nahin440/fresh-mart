'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, PlusCircle, ShoppingCart, Leaf, ArrowLeft, Tags, ListTree, LayoutTemplate, Menu, X } from 'lucide-react';

const NAV = [
  { label:'Dashboard',    href:'/admin/goingintodeep',              icon:LayoutDashboard },
  { label:'Products',     href:'/admin/goingintodeep/products',     icon:Package },
  { label:'Add Product',  href:'/admin/goingintodeep/add-product',  icon:PlusCircle },
  { label:'Categories',   href:'/admin/goingintodeep/add-category', icon:ListTree },
  { label:'Types',        href:'/admin/goingintodeep/add-type',     icon:Tags },
  { label:'Customize Home', href:'/admin/goingintodeep/customize-home', icon:LayoutTemplate },
  { label:'Orders',       href:'/admin/goingintodeep/orders',       icon:ShoppingCart },
];

function SidebarContent({ path, onNavigate }) {
  return (
    <>
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
            <Link key={href} href={href} className={`admin-nav-link${active?' active':''}`} onClick={onNavigate}>
              <Icon size={15}/>{label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding:'1rem 0.75rem',borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" className="admin-nav-link" style={{ fontSize:'0.8125rem' }} onClick={onNavigate}>
          <ArrowLeft size={13}/> Back to Store
        </Link>
      </div>
    </>
  );
}

export default function AdminLayout({ children }) {
  const path = usePathname();
  const [drawer, setDrawer] = useState(false);

  return (
    <div className="admin-wrap">
      {/* Mobile top bar — the only way into the admin nav on small screens,
          since .admin-side is CSS-hidden below 768px */}
      <div className="admin-mobile-bar show-mobile">
        <Link href="/" style={{ display:'flex',alignItems:'center',gap:'0.5rem',textDecoration:'none' }}>
          <div style={{ width:24,height:24,borderRadius:6,background:'linear-gradient(135deg,var(--green),#27ae60)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <Leaf size={12} color="#fff"/>
          </div>
          <span style={{ color:'#fff',fontWeight:800,fontSize:'0.875rem',letterSpacing:'-0.04em' }}>FRESHMART</span>
        </Link>
        <button onClick={() => setDrawer(true)} aria-label="Open admin menu"
          style={{ background:'rgba(255,255,255,0.08)', border:'none', borderRadius:8, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff' }}>
          <Menu size={18} />
        </button>
      </div>

      {/* Mobile drawer */}
      {drawer && (
        <>
          <div onClick={() => setDrawer(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:300 }} />
          <div style={{ position:'fixed', top:0, left:0, bottom:0, width:'min(260px, 82vw)', background:'var(--near-black)', zIndex:301, display:'flex', flexDirection:'column', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'flex-end', padding:'0.75rem' }}>
              <button onClick={() => setDrawer(false)} aria-label="Close menu"
                style={{ background:'rgba(255,255,255,0.08)', border:'none', borderRadius:8, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff' }}>
                <X size={16} />
              </button>
            </div>
            <SidebarContent path={path} onNavigate={() => setDrawer(false)} />
          </div>
        </>
      )}

      {/* Desktop sidebar — persistent, hidden below 768px via .admin-side's media query */}
      <aside className="admin-side">
        <SidebarContent path={path} />
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
