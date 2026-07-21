import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Type } from '@/lib/models';
import typesData from '@/lib/types.json';

export const dynamic = 'force-dynamic';

const toSlug = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const COLORS = ['violet', 'green', 'red', 'dark', 'blue'];

export async function GET() {
  try {
    const db = await connectDB();
    if (db) {
      const types = await Type.find({ isActive: true }).sort({ name: 1 }).lean();
      return NextResponse.json({ types });
    }
    return NextResponse.json({ types: typesData });
  } catch (e) {
    return NextResponse.json({ types: typesData });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.name || !data.name.trim()) {
      return NextResponse.json({ error: 'Type name is required' }, { status: 400 });
    }
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not connected' }, { status: 503 });

    const name = data.name.trim();
    const slug = data.slug ? toSlug(data.slug) : toSlug(name);

    const existing = await Type.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return NextResponse.json({ error: 'A type with that name already exists' }, { status: 409 });
    }

    const type = await Type.create({
      name,
      slug,
      description: data.description || '',
      image: data.image || '',
      color: COLORS.includes(data.color) ? data.color : 'violet',
      isActive: true,
    });
    return NextResponse.json({ type }, { status: 201 });
  } catch (e) {
    if (e.code === 11000) {
      return NextResponse.json({ error: 'A type with that name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
