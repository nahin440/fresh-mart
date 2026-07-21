import HeroSection           from '@/components/home/HeroSection';
import CategorySection       from '@/components/home/CategorySection';
import BestSellersSection    from '@/components/home/BestSellersSection';
import FlashSaleSection      from '@/components/home/FlashSaleSection';
import FeaturedBannerSection from '@/components/home/FeaturedBannerSection';
import NewArrivalsSection    from '@/components/home/NewArrivalsSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import TestimonialsSection   from '@/components/home/TestimonialsSection';
import TrustSection          from '@/components/home/TrustSection';
import NewsletterSection     from '@/components/home/NewsletterSection';
import productsData          from '@/lib/products.json';
import categoriesData        from '@/lib/categories.json';
import typesData             from '@/lib/types.json';

export const metadata = {
  title: 'FreshMart — Premium Organic Grocery Delivered',
  description: 'Shop the finest organic produce, artisan foods & sustainably sourced groceries. Free delivery over £50. Same-day delivery available.',
};

async function getProducts() {
  try {
    const { connectDB } = await import('@/lib/mongodb');
    const { Product }   = await import('@/lib/models');
    const db = await connectDB();
    if (db) {
      const dbProds = await Product.find({ isActive:true }).lean();
      if (dbProds.length > 0)
        return dbProds.map(p => ({ ...p, id:p._id.toString(), _id:undefined }));
    }
  } catch {}
  return productsData;
}

async function getCategories() {
  try {
    const { connectDB } = await import('@/lib/mongodb');
    const { Category }  = await import('@/lib/models');
    const db = await connectDB();
    if (db) {
      const dbCats = await Category.find({ isActive:true }).sort({ name:1 }).lean();
      if (dbCats.length > 0)
        return dbCats.map(c => ({ ...c, _id: c._id.toString() }));
    }
  } catch {}
  return categoriesData;
}

async function getTypes() {
  try {
    const { connectDB } = await import('@/lib/mongodb');
    const { Type }       = await import('@/lib/models');
    const db = await connectDB();
    if (db) {
      const dbTypes = await Type.find({ isActive:true }).sort({ name:1 }).lean();
      if (dbTypes.length > 0)
        return dbTypes.map(t => ({ ...t, _id: t._id.toString() }));
    }
  } catch {}
  return typesData;
}

export default async function HomePage() {
  const [products, categories, types] = await Promise.all([
    getProducts(),
    getCategories(),
    getTypes(),
  ]);
  return (
    <>
      <HeroSection />
      <CategorySection      categories={categories} />
      <BestSellersSection   products={products} types={types} />
      <FlashSaleSection     products={products} />
      <FeaturedBannerSection />
      <NewArrivalsSection   products={products} />
      <FeaturedProductsSection products={products} />
      <TestimonialsSection />
      <TrustSection />
      <NewsletterSection />
    </>
  );
}
