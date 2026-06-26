import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models';

const fallbackOrders = [];

export async function POST(request) {
  try {
    const data = await request.json();
    const db = await connectDB();
    if (db) {
      const order = await Order.create(data);
      return NextResponse.json({ order, orderNumber: order.orderNumber }, { status: 201 });
    } else {
      const order = { ...data, orderNumber: 'FM' + Date.now().toString().slice(-8), _id: Date.now().toString(), createdAt: new Date() };
      fallbackOrders.push(order);
      return NextResponse.json({ order, orderNumber: order.orderNumber }, { status: 201 });
    }
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await connectDB();
    if (db) {
      const orders = await Order.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({ orders });
    }
    return NextResponse.json({ orders: fallbackOrders });
  } catch (e) {
    return NextResponse.json({ orders: [] });
  }
}
