'use client';
import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const REVIEWS = [
  { name: 'Sarah Mitchell', location: 'London', rating: 5, img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80', text: 'The organic produce quality is simply exceptional. Everything arrives perfectly fresh and beautifully packaged. The avocados were perfectly ripe — I cannot imagine going back to supermarket shopping.' },
  { name: 'James Keane', location: 'Manchester', rating: 5, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', text: 'Been ordering weekly for 6 months and the consistency is incredible. The sourdough bread and Greek yogurt have become non-negotiables in our household. Delivery is always on time.' },
  { name: 'Priya Sharma', location: 'Edinburgh', rating: 5, img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', text: 'Same-day delivery is genuinely a game changer. I ordered at noon and the wildflower honey arrived by 5pm. The quality of everything is so far above anything else I have tried online.' },
  { name: 'Tom Richards', location: 'Bristol', rating: 5, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', text: 'Outstanding selection of artisan and organic products. The cold brew coffee concentrate is remarkable — rich, smooth, and genuinely café quality. Will not shop anywhere else for groceries.' },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const r = REVIEWS[active];

  return (
    <section className="section" style={{ background: 'var(--off-white)', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem,5vw,3.5rem)' }}>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Testimonials</span>
          <h2 className="t-h2">What Our Customers Say</h2>
        </div>

        {/* Featured review */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '2rem', alignItems: 'center', marginBottom: '2.5rem' }}>
          {/* Big quote */}
          <div className="afu" key={`review-${active}`}>
            <div style={{ width: 48, height: 48, background: 'var(--violet)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Quote size={22} color="#fff" />
            </div>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.65, color: 'var(--ink)', marginBottom: '1.75rem' }}>
              "{r.text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src={r.img} alt={r.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.02em' }}>{r.name}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--slate)' }}>{r.location}</p>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
              </div>
            </div>
          </div>

          {/* Thumbnail grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {REVIEWS.map((rv, i) => (
              <button key={i} onClick={() => setActive(i)}
                style={{ background: i === active ? 'var(--violet)' : '#fff', border: `2px solid ${i === active ? 'var(--violet)' : 'var(--hairline)'}`, borderRadius: 16, padding: '1rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.22s', color: i === active ? '#fff' : 'var(--ink)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                  <img src={rv.img} alt={rv.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.8125rem', letterSpacing: '-0.01em' }}>{rv.name}</p>
                    <p style={{ fontSize: '0.6875rem', opacity: 0.65 }}>{rv.location}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', lineHeight: 1.5, opacity: i === active ? 0.85 : 0.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {rv.text}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', padding: '2rem', background: 'var(--ink)', borderRadius: 20 }}>
          {[['50,000+','Happy Customers'],['4.9/5','Average Rating'],['98%','Satisfaction'],['24h','Avg Delivery']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', marginBottom: 4 }}>{n}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
