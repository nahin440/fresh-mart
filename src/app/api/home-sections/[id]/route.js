import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { HomeSection } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function DELETE(request, ctx) {
  try {
    const { id } = await ctx.params;
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not connected' }, { status: 503 });
    await HomeSection.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
