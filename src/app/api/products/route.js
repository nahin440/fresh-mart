import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models';
import productsData from '@/lib/products.json';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'default';
  const flashSale = searchParams.get('flashSale');
  const newArrival = searchParams.get('newArrival');
  const organic = searchParams.get('organic');
  const type = searchParams.get('type'); // generic type slug, e.g. "featured" — works for any admin-created type, not just the three legacy booleans above
  // Filtering to active-only is opt-in, not the default — the admin product
  // list needs to see every product (including any without isActive set,
  // or explicitly deactivated ones) so nothing becomes invisible and
  // unrecoverable. The storefront passes active=true explicitly.
  const activeOnly = searchParams.get('active') === 'true';
  // Like activeOnly above, the price range is opt-in — only applied when the
  // caller actually passes minPrice/maxPrice. Previously maxPrice defaulted
  // to 999 even when no price filter was requested, which silently dropped
  // any product priced above that from EVERY /api/products call (admin
  // pages happened to stay under it with demo data, but the public
  // storefront was one hardcoded default away from hiding real inventory —
  // especially once prices are in BDT, where everyday grocery prices
  // routinely exceed 999).
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const minPrice = minPriceParam !== null ? parseFloat(minPriceParam) : null;
  const maxPrice = maxPriceParam !== null ? parseFloat(maxPriceParam) : null;

  try {
    const db = await connectDB();
    let products;
    if (db) {
      let query = {};
      if (activeOnly) query.isActive = { $ne: false }; // catches true AND missing/undefined, not just strictly-true
      if (category && category !== 'All') query.category = category;
      if (flashSale) query.isFlashSale = true;
      if (newArrival) query.isNewArrival = true;
      if (organic) query.isOrganic = true;
      if (type) query.types = type;
      if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { category: { $regex: search, $options: 'i' } }];
      if (minPrice !== null || maxPrice !== null) {
        query.price = {};
        if (minPrice !== null) query.price.$gte = minPrice;
        if (maxPrice !== null) query.price.$lte = maxPrice;
      }
      products = await Product.find(query).lean();
    } else {
      products = productsData;
      if (activeOnly) products = products.filter(p => p.isActive !== false);
      if (category && category !== 'All') products = products.filter(p => p.category === category);
      if (flashSale) products = products.filter(p => p.isFlashSale);
      if (newArrival) products = products.filter(p => p.isNewArrival);
      if (organic) products = products.filter(p => p.isOrganic);
      if (type) products = products.filter(p => Array.isArray(p.types) && p.types.includes(type));
      if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
      if (minPrice !== null) products = products.filter(p => p.price >= minPrice);
      if (maxPrice !== null) products = products.filter(p => p.price <= maxPrice);
    }
    if (sort === 'price-asc') products.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') products.sort((a, b) => b.price - a.price);
    if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);
    if (sort === 'discount') products.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    return NextResponse.json({ products, total: products.length });
  } catch (e) {
    return NextResponse.json({ products: productsData, total: productsData.length });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not connected' }, { status: 503 });
    const product = await Product.create(data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    if (e.code === 11000) {
      const field = Object.keys(e.keyPattern || {})[0] || 'field';
      return NextResponse.json({ error: `A product with that ${field} already exists` }, { status: 409 });
    }
    if (e.name === 'ValidationError') {
      const firstError = Object.values(e.errors)[0]?.message || 'Invalid product data';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
