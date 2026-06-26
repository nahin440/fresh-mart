import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models';

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not connected' }, { status: 503 });
    const order = await Order.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ order });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not connected' }, { status: 503 });
    const order = await Order.findById(id).lean();
    return NextResponse.json({ order });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
