'use client';
import Link from 'next/link';

const CATS = [
  { name: 'Fruits & Veg', emoji: '🥦', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=75', href: '/products?category=Fruits+%26+Vegetables', count: '85+' },
  { name: 'Dairy & Eggs', emoji: '🥛', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=75', href: '/products?category=Dairy+%26+Eggs', count: '42+' },
  { name: 'Bakery', emoji: '🍞', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=75', href: '/products?category=Bakery+%26+Bread', count: '30+' },
  { name: 'Pantry', emoji: '🫙', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=75', href: '/products?category=Pantry+%26+Dry+Goods', count: '60+' },
  { name: 'Meat & Fish', emoji: '🐟', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=75', href: '/products?category=Meat+%26+Seafood', count: '25+' },
  { name: 'Beverages', emoji: '☕', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=75', href: '/products?category=Beverages', count: '48+' },
  { name: 'Snacks', emoji: '🍫', image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&q=75', href: '/products?category=Snacks+%26+Confectionery', count: '36+' },
];

export default function CategorySection() {
  return (
    <section className="section-sm" style={{ background: 'var(--canvas)' }}>
      <div className="page-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: 4 }}>Browse</p>
            <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em' }}>Shop by Category</h2>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 12 }}>
          {CATS.map((cat, i) => (
            <Link key={cat.name} href={cat.href}
              className="anim-fade-up"
              style={{ textDecoration: 'none', animationDelay: `${i * 0.05}s` }}>
              <div className="card" style={{ overflow: 'hidden', border: '1px solid var(--hairline)' }}
                onMouseEnter={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1.08)'; e.currentTarget.style.borderColor = 'var(--violet)'; }}
                onMouseLeave={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'var(--hairline)'; }}>
                <div style={{ height: 90, overflow: 'hidden', background: 'var(--canvas)' }}>
                  <img src={cat.image} alt={cat.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                </div>
                <div style={{ padding: '10px 10px 12px', textAlign: 'center' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 2 }}>{cat.name}</p>
                  <p style={{ fontSize: 10, color: 'var(--slate)' }}>{cat.count} items</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* Mobile horizontal scroll */}
      </div>
    </section>
  );
}
