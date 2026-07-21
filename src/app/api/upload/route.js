import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';
const MAX_SIZE_BYTES = 32 * 1024 * 1024; // ImgBB's own stated limit
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];

// Proxies image uploads to ImgBB. The API key lives only in this server-side
// route (IMGBB_API_KEY, no NEXT_PUBLIC_ prefix) — the browser never sees it,
// which matters since this key can be used by anyone who has it to burn your
// ImgBB quota.
export async function POST(request) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'IMGBB_API_KEY is not set on the server. Add it to .env.local and restart the dev server.' },
      { status: 503 }
    );
  }

  let incomingForm;
  try {
    incomingForm = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data with an "image" field' }, { status: 400 });
  }

  const file = incomingForm.get('image');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: `Unsupported file type: ${file.type || 'unknown'}` }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'Image exceeds 32MB limit' }, { status: 400 });
  }

  try {
    const outgoingForm = new FormData();
    outgoingForm.append('key', apiKey);
    outgoingForm.append('image', file, file.name);

    const imgbbRes = await fetch(IMGBB_UPLOAD_URL, {
      method: 'POST',
      body: outgoingForm,
    });
    const result = await imgbbRes.json();

    if (!imgbbRes.ok || !result.success) {
      const message = result?.error?.message || 'ImgBB upload failed';
      return NextResponse.json({ error: message }, { status: imgbbRes.status || 502 });
    }

    return NextResponse.json({
      url: result.data.url,
      thumbUrl: result.data.thumb?.url || result.data.url,
      deleteUrl: result.data.delete_url,
      width: result.data.width,
      height: result.data.height,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 });
  }
}
