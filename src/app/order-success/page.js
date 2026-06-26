'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || 'FM' + Date.now().toString().slice(-8);

  return (
    <div className="max-w-[640px] mx-auto px-6 py-20 text-center">
      {/* Success icon */}
      <div className="w-20 h-20 bg-[var(--color-accent-pale)] flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-[var(--color-accent)]" />
      </div>

      <h1 className="text-3xl font-normal text-[#222] mb-3">Order Confirmed!</h1>
      <p className="text-[var(--color-graphite)] mb-2">Thank you for your order. We're preparing your fresh groceries.</p>
      <p className="text-[13px] text-[var(--color-graphite)] mb-8">
        Order number: <span className="font-medium text-[#222]">{orderNumber}</span>
      </p>

      {/* Timeline */}
      <div className="bg-[var(--color-stone)] p-6 mb-8 text-left">
        <h2 className="text-[11px] tracking-[2px] uppercase text-[var(--color-graphite)] mb-5">What Happens Next</h2>
        <div className="space-y-4">
          {[
            { icon: CheckCircle, title: 'Order Received', desc: 'We\'ve received your order and are processing it.', done: true },
            { icon: Package, title: 'Preparing Your Order', desc: 'Our team is carefully selecting your fresh items.', done: false },
            { icon: Truck, title: 'Out for Delivery', desc: 'Your order is on its way to your address.', done: false },
            { icon: Home, title: 'Delivered', desc: 'Enjoy your fresh groceries!', done: false },
          ].map(({ icon: Icon, title, desc, done }, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-8 h-8 flex items-center justify-center shrink-0"
                style={{ background: done ? 'var(--color-accent)' : 'var(--color-smoke)' }}>
                <Icon size={14} color={done ? 'white' : 'var(--color-graphite)'} />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#222]">{title}</p>
                <p className="text-[12px] text-[var(--color-graphite)]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary text-xs">
          <Home size={14} /> Back to Home
        </Link>
        <Link href="/products" className="btn-secondary text-xs">
          <ShoppingBag size={14} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
