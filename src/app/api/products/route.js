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
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '999');

  try {
    const db = await connectDB();
    let products;
    if (db) {
      let query = { isActive: true };
      if (category && category !== 'All') query.category = category;
      if (flashSale) query.isFlashSale = true;
      if (newArrival) query.isNewArrival = true;
      if (organic) query.isOrganic = true;
      if (type) query.types = type;
      if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { category: { $regex: search, $options: 'i' } }];
      query.price = { $gte: minPrice, $lte: maxPrice };
      products = await Product.find(query).lean();
    } else {
      products = productsData;
      if (category && category !== 'All') products = products.filter(p => p.category === category);
      if (flashSale) products = products.filter(p => p.isFlashSale);
      if (newArrival) products = products.filter(p => p.isNewArrival);
      if (organic) products = products.filter(p => p.isOrganic);
      if (type) products = products.filter(p => Array.isArray(p.types) && p.types.includes(type));
      if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
      products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);
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
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
