import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Category, Product } from '@/lib/models';

export const dynamic = 'force-dynamic';

const toSlug = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export async function GET(request, ctx) {
  const { id } = await ctx.params;
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not connected' }, { status: 503 });
    const category = await Category.findById(id).lean();
    if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ category });
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

    const existing = await Category.findById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const oldName = existing.name;

    const update = {};
    if (data.name?.trim()) update.name = data.name.trim();
    if (data.description !== undefined) update.description = data.description;
    if (data.image !== undefined) update.image = data.image;
    if (data.slug?.trim()) update.slug = toSlug(data.slug);
    else if (update.name) update.slug = toSlug(update.name);

    const category = await Category.findByIdAndUpdate(id, update, { new: true, runValidators: true });

    // Product.category stores the category's name as a plain string (not a
    // reference), so a rename has to cascade or every product using the old
    // name would silently fall out of that category everywhere — the
    // products page filter, the category dropdown, the homepage strip.
    if (update.name && update.name !== oldName) {
      await Product.updateMany({ category: oldName }, { $set: { category: update.name } });
    }

    return NextResponse.json({ category });
  } catch (e) {
    if (e.code === 11000) return NextResponse.json({ error: 'A category with that name already exists' }, { status: 409 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, ctx) {
  const { id } = await ctx.params;
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not connected' }, { status: 503 });

    const category = await Category.findById(id).lean();
    if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Products reference categories by name (a plain string, not an
    // ObjectId — see the Product schema), so deleting a category can't
    // cascade automatically. Block the delete instead of silently leaving
    // products pointing at a category that no longer exists.
    const inUse = await Product.countDocuments({ category: category.name });
    if (inUse > 0) {
      return NextResponse.json(
        { error: `${inUse} product${inUse > 1 ? 's' : ''} still use this category. Reassign or delete them first.` },
        { status: 409 }
      );
    }

    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
