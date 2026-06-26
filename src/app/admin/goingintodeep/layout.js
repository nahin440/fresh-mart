'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, PlusCircle, ShoppingCart, Leaf, ArrowLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { label: 'Dashboard', href: '/admin/goingintodeep', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/goingintodeep/products', icon: Package },
  { label: 'Add Product', href: '/admin/goingintodeep/add-product', icon: PlusCircle },
  { label: 'Orders', href: '/admin/goingintodeep/orders', icon: ShoppingCart },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ padding: '24px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 4 }}>
            <div style={{ background: 'var(--accent-green)', width: 26, height: 26, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={13} color="#fff" />
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '-0.03em' }}>FRESHMART</span>
          </Link>
          <p style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Panel</p>
        </div>
        <nav style={{ padding: '12px 8px', flex: 1 }}>
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = href === '/admin/goingintodeep' ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`admin-nav-item${active ? ' active' : ''}`}>
                <Icon size={15} />{label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: '16px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/" className="admin-nav-item" style={{ fontSize: 12 }}>
            <ArrowLeft size={13} /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div style={{ display: 'none' }} className="show-mobile" style2={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'var(--near-black)', padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Admin</span>
        <button onClick={() => setMobileNav(!mobileNav)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          {mobileNav ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <main className="admin-content" style={{ padding: '0' }}>
        {children}
      </main>
    </div>
  );
}
