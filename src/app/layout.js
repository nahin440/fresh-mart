import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: { default: 'FreshMart — Premium Organic Grocery', template: '%s | FreshMart' },
  description: 'Shop the finest organic, locally sourced groceries. Free delivery over £50. Same-day delivery available.',
  keywords: ['organic grocery', 'fresh produce', 'online supermarket', 'sustainable food'],
  openGraph: {
    title: 'FreshMart — Premium Organic Grocery',
    description: 'Shop the finest organic, locally sourced groceries.',
    type: 'website',
    siteName: 'FreshMart',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {/* Inter from CDN as system fallback available locally */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        `}</style>
      </head>
      <body>
        <CartProvider>
          <WishlistProvider>
            <Header />
            <CartDrawer />
            <main style={{ minHeight: '60vh' }}>{children}</main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#121212',
                  color: '#fff',
                  borderRadius: '28px',
                  fontSize: '13px',
                  padding: '12px 20px',
                  letterSpacing: '-0.02em',
                },
                duration: 2500,
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
