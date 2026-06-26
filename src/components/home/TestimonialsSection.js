'use client';
import { Star } from 'lucide-react';

const REVIEWS = [
  { name: 'Sarah M.', location: 'London', rating: 5, text: 'The organic produce quality is exceptional. Everything arrived perfectly fresh and the packaging is beautifully minimal.', img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&q=80' },
  { name: 'James K.', location: 'Manchester', rating: 5, text: "Been ordering weekly for 6 months. The sourdough and Greek yogurt have become breakfast staples in our household.", img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
  { name: 'Priya S.', location: 'Edinburgh', rating: 5, text: 'Same-day delivery is a game changer. The avocados were perfectly ripe and the honey is unlike anything I have tasted.', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80' },
  { name: 'Tom R.', location: 'Bristol', rating: 5, text: 'Outstanding artisan and organic selection. The cold brew coffee is remarkable. Will not shop anywhere else.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
];

export default function TestimonialsSection() {
  return (
    <section className="section-sm" style={{ background: 'var(--canvas)' }}>
      <div className="page-container">
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: 8 }}>Testimonials</p>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>What Customers Say</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {REVIEWS.map((r, i) => (
            <div key={i} className="card anim-fade-up" style={{ padding: 20, animationDelay: `${i * 0.1}s` }}>
              <div style={{ display: 'flex', marginBottom: 12 }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={13} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                ))}
              </div>
              <p style={{ fontSize: 13, color: 'var(--ash)', lineHeight: 1.65, marginBottom: 16, fontStyle: 'italic' }}>"{r.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 14, borderTop: '1px solid var(--hairline)' }}>
                <img src={r.img} alt={r.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.02em' }}>{r.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--slate)' }}>{r.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
