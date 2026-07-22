import HeroSection           from '@/components/home/HeroSection';
import CategorySection       from '@/components/home/CategorySection';
import BestSellersSection    from '@/components/home/BestSellersSection';
import FlashSaleSection      from '@/components/home/FlashSaleSection';
import FeaturedBannerSection from '@/components/home/FeaturedBannerSection';
import NewArrivalsSection    from '@/components/home/NewArrivalsSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import CustomSection         from '@/components/home/CustomSection';
import TestimonialsSection   from '@/components/home/TestimonialsSection';
import TrustSection          from '@/components/home/TrustSection';
import NewsletterSection     from '@/components/home/NewsletterSection';
import productsData          from '@/lib/products.json';
import categoriesData        from '@/lib/categories.json';
import typesData             from '@/lib/types.json';
import { DEFAULT_HOME_SECTIONS } from '@/lib/defaultHomeSections';

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
  } catch (err) {
    console.error('[homepage] getProducts failed, falling back to demo data:', err.message);
  }
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
  } catch (err) {
    console.error('[homepage] getCategories failed, falling back to demo data:', err.message);
  }
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
  } catch (err) {
    console.error('[homepage] getTypes failed, falling back to demo data:', err.message);
  }
  return typesData;
}

async function getHomeSections() {
  try {
    const { connectDB } = await import('@/lib/mongodb');
    const { HomeSection } = await import('@/lib/models');
    const db = await connectDB();
    if (db) {
      const sections = await HomeSection.find({}).sort({ order: 1 }).lean();
      if (sections.length > 0)
        return sections.map(s => ({ ...s, _id: s._id.toString() }));
    }
  } catch (err) {
    console.error('[homepage] getHomeSections failed, falling back to defaults:', err.message);
  }
  return DEFAULT_HOME_SECTIONS;
}

export default async function HomePage() {
  const [products, categories, types, sections] = await Promise.all([
    getProducts(),
    getCategories(),
    getTypes(),
    getHomeSections(),
  ]);

  return (
    <>
      {sections.filter(s => s.enabled !== false).map((s, i) => {
        const key = s._id || `${s.kind}-${i}`;
        switch (s.kind) {
          case 'hero':            return <HeroSection key={key} />;
          case 'category-strip':  return <CategorySection key={key} categories={categories} />;
          case 'best-sellers':    return <BestSellersSection key={key} products={products} types={types} limit={s.limit} title={s.title} />;
          case 'flash-sale':      return <FlashSaleSection key={key} products={products} limit={s.limit} title={s.title} />;
          case 'banner':          return <FeaturedBannerSection key={key} />;
          case 'new-arrivals':    return <NewArrivalsSection key={key} products={products} limit={s.limit} title={s.title} />;
          case 'featured':        return <FeaturedProductsSection key={key} products={products} limit={s.limit} title={s.title} subtitle={s.subtitle} />;
          case 'custom':          return <CustomSection key={key} products={products} title={s.title} subtitle={s.subtitle} limit={s.limit} filterType={s.filterType} filterCategory={s.filterCategory} />;
          case 'testimonials':    return <TestimonialsSection key={key} />;
          case 'trust':           return <TrustSection key={key} />;
          case 'newsletter':      return <NewsletterSection key={key} />;
          default:                return null;
        }
      })}
    </>
  );
}
