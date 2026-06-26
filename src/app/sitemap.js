import productsData from '@/lib/products.json';
export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/wishlist`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    ...productsData.map(p => ({
      url: `${base}/products/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
  ];
}
