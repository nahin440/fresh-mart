import './globals.css';
import { CartProvider }    from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Header     from '@/components/layout/Header';
import Footer     from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: { default: 'FreshMart — Premium Organic Grocery', template: '%s | FreshMart' },
  description: 'Shop the finest organic, locally sourced groceries. Free delivery over ৳50. Same-day delivery available.',
  keywords: ['organic grocery', 'fresh produce', 'online supermarket', 'sustainable food'],
  openGraph: { title: 'FreshMart', description: 'Premium organic groceries delivered.', type: 'website', siteName: 'FreshMart' },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'),
};

export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        <CartProvider>
          <WishlistProvider>
            <Header />
            <CartDrawer />
            <main style={{ minHeight: '60vh' }}>{children}</main>
            <Footer />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: { background: '#111', color: '#fff', borderRadius: '100px', fontSize: '0.875rem', padding: '0.75rem 1.25rem', letterSpacing: '-0.01em', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' },
                duration: 2200,
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
