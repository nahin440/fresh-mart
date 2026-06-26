import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import BestSellersSection from '@/components/home/BestSellersSection';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import FeaturedBannerSection from '@/components/home/FeaturedBannerSection';
import NewArrivalsSection from '@/components/home/NewArrivalsSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import TrustSection from '@/components/home/TrustSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import productsData from '@/lib/products.json';

export const metadata = {
  title: 'FreshMart — Premium Organic Grocery Delivered',
  description: 'Shop the finest organic produce, artisan foods, and sustainably sourced groceries. Free delivery over £50. Same-day delivery available.',
};

async function getProducts() {
  try {
    const { connectDB } = await import('@/lib/mongodb');
    const { Product } = await import('@/lib/models');
    const db = await connectDB();
    if (db) {
      const dbProducts = await Product.find({ isActive: true }).lean();
      if (dbProducts.length > 0) {
        return dbProducts.map(p => ({ ...p, id: p._id.toString(), _id: undefined }));
      }
    }
  } catch {}
  return productsData;
}

export default async function HomePage() {
  const products = await getProducts();
  return (
    <>
      <HeroSection />
      <CategorySection />
      <BestSellersSection products={products} />
      <FlashSaleSection products={products} />
      <FeaturedBannerSection />
      <NewArrivalsSection products={products} />
      <FeaturedProductsSection products={products} />
      <TestimonialsSection />
      <TrustSection />
      <NewsletterSection />
    </>
  );
}
