import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models';
import productsData from '@/lib/products.json';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const db = await connectDB();
    if (db) {
      const product = await Product.findById(id).lean() || await Product.findOne({ slug: id }).lean();
      if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ product });
    } else {
      const product = productsData.find(p => p.id === id || p.slug === id);
      if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ product });
    }
  } catch (e) {
    const product = productsData.find(p => p.id === id || p.slug === id);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ product });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not connected' }, { status: 503 });
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ product });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not connected' }, { status: 503 });
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
