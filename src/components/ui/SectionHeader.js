export default function SectionHeader({ eyebrow, title, subtitle, center = true }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 28 }}>
      {eyebrow && <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: 6 }}>{eyebrow}</p>}
      <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 14, color: 'var(--slate)', marginTop: 8, maxWidth: 480, margin: center ? '8px auto 0' : '8px 0 0' }}>{subtitle}</p>}
    </div>
  );
}
