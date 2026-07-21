import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Category } from '@/lib/models';
import categoriesData from '@/lib/categories.json';

export const dynamic = 'force-dynamic';

const toSlug = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export async function GET() {
  try {
    const db = await connectDB();
    if (db) {
      const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
      return NextResponse.json({ categories });
    }
    return NextResponse.json({ categories: categoriesData });
  } catch (e) {
    return NextResponse.json({ categories: categoriesData });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.name || !data.name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not connected' }, { status: 503 });

    const name = data.name.trim();
    const slug = data.slug ? toSlug(data.slug) : toSlug(name);

    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return NextResponse.json({ error: 'A category with that name already exists' }, { status: 409 });
    }

    const category = await Category.create({
      name,
      slug,
      image: data.image || '',
      description: data.description || '',
      isActive: true,
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (e) {
    if (e.code === 11000) {
      return NextResponse.json({ error: 'A category with that name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
