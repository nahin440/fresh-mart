'use client';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// react-quill-new touches `document` on load, so it must never render on the
// server. dynamic(..., { ssr: false }) is what makes that safe inside a Next
// app router page — a plain top-level import would break the server build.
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 180, border: '1px solid var(--hairline)', borderRadius: 10, background: 'var(--canvas)' }} />
  ),
});

const MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

const FORMATS = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'link'];

export default function DescriptionEditor({ value, onChange, placeholder }) {
  return (
    <div className="quill-wrap">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={MODULES}
        formats={FORMATS}
        placeholder={placeholder}
      />
    </div>
  );
}
