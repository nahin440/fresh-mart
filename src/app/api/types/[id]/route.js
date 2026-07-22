import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Type, Product } from '@/lib/models';

export const dynamic = 'force-dynamic';

const toSlug = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const COLORS = ['violet', 'green', 'red', 'dark', 'blue'];

export async function GET(request, ctx) {
  const { id } = await ctx.params;
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not connected' }, { status: 503 });
    const type = await Type.findById(id).lean();
    if (!type) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ type });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request, ctx) {
  const { id } = await ctx.params;
  try {
    const data = await request.json();
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not connected' }, { status: 503 });

    const existing = await Type.findById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const update = {};
    if (data.name?.trim()) update.name = data.name.trim();
    if (data.description !== undefined) update.description = data.description;
    if (data.image !== undefined) update.image = data.image;
    if (data.color !== undefined) update.color = COLORS.includes(data.color) ? data.color : existing.color;
    const oldSlug = existing.slug;
    if (data.slug?.trim()) update.slug = toSlug(data.slug);
    else if (update.name) update.slug = toSlug(update.name);

    const type = await Type.findByIdAndUpdate(id, update, { new: true, runValidators: true });

    // If the slug changed, every product tagged with the old slug needs to
    // move to the new one, or they'd silently fall out of this type
    // everywhere (homepage sections, filters, the legacy boolean sync).
    if (update.slug && update.slug !== oldSlug) {
      await Product.updateMany({ types: oldSlug }, { $set: { 'types.$': update.slug } });
    }

    return NextResponse.json({ type });
  } catch (e) {
    if (e.code === 11000) return NextResponse.json({ error: 'A type with that name already exists' }, { status: 409 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, ctx) {
  const { id } = await ctx.params;
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not connected' }, { status: 503 });

    const type = await Type.findById(id).lean();
    if (!type) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const inUse = await Product.countDocuments({ types: type.slug });
    if (inUse > 0) {
      return NextResponse.json(
        { error: `${inUse} product${inUse > 1 ? 's' : ''} still use this type. Remove it from those products first.` },
        { status: 409 }
      );
    }

    await Type.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
