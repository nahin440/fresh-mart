import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { HomeSection } from '@/lib/models';
import { DEFAULT_HOME_SECTIONS } from '@/lib/defaultHomeSections';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await connectDB();
    if (db) {
      const sections = await HomeSection.find({}).sort({ order: 1 }).lean();
      if (sections.length > 0) return NextResponse.json({ sections });
    }
    // Nothing customized yet (or no DB) — fall back to the defaults so the
    // homepage still renders exactly as it always has.
    return NextResponse.json({ sections: DEFAULT_HOME_SECTIONS });
  } catch (e) {
    return NextResponse.json({ sections: DEFAULT_HOME_SECTIONS });
  }
}

// Creates a new custom (type/category-filtered) section. Built-in kinds
// (hero, flash-sale, etc.) are seeded once via /api/home-sections/init and
// edited via PUT on their own id — POST here is specifically for adding new
// "custom" rows, since that's the one kind meant to be created freely.
export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.title || !data.title.trim()) {
      return NextResponse.json({ error: 'Section title is required' }, { status: 400 });
    }
    if (!data.filterType && !data.filterCategory) {
      return NextResponse.json({ error: 'Select a type or category to filter by' }, { status: 400 });
    }
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not connected' }, { status: 503 });

    const maxOrder = await HomeSection.findOne({}).sort({ order: -1 }).lean();
    const section = await HomeSection.create({
      kind: 'custom',
      title: data.title.trim(),
      subtitle: data.subtitle || '',
      limit: Number(data.limit) || 8,
      filterType: data.filterType || undefined,
      filterCategory: data.filterCategory || undefined,
      enabled: true,
      order: (maxOrder?.order ?? -1) + 1,
    });
    return NextResponse.json({ section }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// Bulk save — the admin UI sends the complete, reordered list on every
// change (toggle, reorder, limit edit) rather than diffing individual
// fields, since reordering is inherently a whole-list operation and this
// keeps the client/server contract simple.
export async function PUT(request) {
  try {
    const { sections } = await request.json();
    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: 'Expected a sections array' }, { status: 400 });
    }
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not connected' }, { status: 503 });

    // If this is the very first save, the built-ins won't have _ids yet
    // (GET was serving DEFAULT_HOME_SECTIONS, which are plain objects) —
    // upsert by kind+order-less identity isn't reliable, so instead: any
    // section without an _id gets created fresh, any with one gets updated.
    const ops = sections.map((s, i) => {
      const { _id, ...rest } = s;
      const doc = { ...rest, order: i };
      if (_id) {
        return HomeSection.findByIdAndUpdate(_id, doc, { new: true });
      }
      return HomeSection.create(doc);
    });
    const saved = await Promise.all(ops);
    return NextResponse.json({ sections: saved });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
