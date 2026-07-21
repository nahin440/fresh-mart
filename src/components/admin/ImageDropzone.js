'use client';
import { useState, useRef } from 'react';
import { UploadCloud, X, Loader, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';

// Uploads a File to ImgBB via our own /api/upload proxy (keeps the ImgBB key
// server-side) and returns the hosted URL, or null on failure (toast already
// shown, caller doesn't need to handle the error itself).
async function uploadFile(file) {
  const body = new FormData();
  body.append('image', file);
  const res = await fetch('/api/upload', { method: 'POST', body });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.url;
}

// Single-image dropzone — used for the "Main Image" slot. Drag-and-drop,
// click-to-browse, or paste-a-URL (via the sibling text input this doesn't
// render itself — see MainImageField below) all land in the same onChange.
export function ImageDropzone({ value, onChange, label = 'Drag & drop an image, or click to browse' }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.type?.startsWith('image/')) {
      toast.error('Please drop an image file');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
      toast.success('Image uploaded');
    } catch (e) {
      toast.error(e.message);
    }
    setUploading(false);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `1.5px dashed ${dragging ? 'var(--violet)' : 'var(--hairline)'}`,
        borderRadius: 14,
        background: dragging ? 'var(--violet-pale)' : 'var(--canvas)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        cursor: uploading ? 'wait' : 'pointer',
        transition: 'all 0.15s',
        textAlign: 'center',
        minHeight: 120,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {uploading ? (
        <>
          <Loader size={22} className="spin" style={{ color: 'var(--violet)' }} />
          <span style={{ fontSize: '0.8125rem', color: 'var(--slate)', fontWeight: 600 }}>Uploading…</span>
        </>
      ) : value ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', width: '100%' }}>
          <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', background: '#fff', flexShrink: 0, border: '1px solid var(--hairline)' }}>
            <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
          </div>
          <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)' }}>Image set</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(''); }}
            style={{ background: '#fff', border: '1px solid var(--hairline)', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <>
          <UploadCloud size={22} style={{ color: 'var(--muted)' }} />
          <span style={{ fontSize: '0.8125rem', color: 'var(--slate)', fontWeight: 600 }}>{label}</span>
          <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>JPG, PNG, GIF or WEBP — up to 32MB</span>
        </>
      )}
    </div>
  );
}

// Multi-image dropzone — used for "Additional Images". Accepts multiple
// files at once (drag or click), uploads each in parallel, appends the
// resulting URLs to the existing list.
export function MultiImageDropzone({ urls, onChange }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter(f => f.type?.startsWith('image/'));
    if (!files.length) {
      toast.error('Please drop image files');
      return;
    }
    setUploading(true);
    const results = await Promise.allSettled(files.map(uploadFile));
    const newUrls = results.filter(r => r.status === 'fulfilled').map(r => r.value);
    const failed = results.filter(r => r.status === 'rejected').length;
    if (newUrls.length) onChange([...urls, ...newUrls]);
    if (failed) toast.error(`${failed} image${failed > 1 ? 's' : ''} failed to upload`);
    if (newUrls.length) toast.success(`${newUrls.length} image${newUrls.length > 1 ? 's' : ''} uploaded`);
    setUploading(false);
  };

  const removeAt = (idx) => onChange(urls.filter((_, i) => i !== idx));

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `1.5px dashed ${dragging ? 'var(--violet)' : 'var(--hairline)'}`,
          borderRadius: 14,
          background: dragging ? 'var(--violet-pale)' : 'var(--canvas)',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          cursor: uploading ? 'wait' : 'pointer',
          transition: 'all 0.15s',
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
        {uploading
          ? <><Loader size={16} className="spin" style={{ color: 'var(--violet)' }} /><span style={{ fontSize: '0.8125rem', color: 'var(--slate)', fontWeight: 600 }}>Uploading…</span></>
          : <><ImagePlus size={16} style={{ color: 'var(--muted)' }} /><span style={{ fontSize: '0.8125rem', color: 'var(--slate)', fontWeight: 600 }}>Drag & drop or click to add images</span></>
        }
      </div>

      {urls.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginTop: '0.75rem' }}>
          {urls.map((url, idx) => (
            <div key={idx} style={{ position: 'relative', width: 64, height: 64, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--hairline)', background: 'var(--canvas)' }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 6, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={11} color="#fff" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
