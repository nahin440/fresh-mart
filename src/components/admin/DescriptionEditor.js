'use client';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';

// @uiw/react-md-editor touches `document` on load, same as any editor that
// wraps a live textarea/CodeMirror instance, so it must never render on the
// server — dynamic(..., { ssr: false }) is what makes that safe here.
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 200, border: '1px solid var(--hairline)', borderRadius: 10, background: 'var(--canvas)' }} />
  ),
});

export default function DescriptionEditor({ value, onChange, placeholder }) {
  return (
    <div className="md-editor-wrap" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v || '')}
        height={200}
        preview="edit"
        textareaProps={{ placeholder }}
      />
    </div>
  );
}
