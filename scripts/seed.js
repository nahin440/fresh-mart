// One-off seed script — run with:
//   node scripts/seed.js
//
// Populates MongoDB with:
//   - the 7 product categories
//   - the 5 product types (flash-sale, new-arrivals, featured, best-seller, organic)
//   - all 20 demo products from src/lib/products.json, with their legacy
//     boolean flags (isOrganic, isFlashSale, ...) translated into the new
//     `types` array so they show up correctly in the admin type multi-select
//
// Safe to re-run: categories/types are upserted by slug, and products are
// wiped and reinserted each run (this is demo/seed data, not meant to
// coexist with hand-entered admin data — see the --keep-products flag below
// if you've already added real products and just want categories/types).
//
// Requires MONGODB_URI to be set, either in your shell or in .env.local
// (this script loads .env.local itself since it runs outside Next.js).

import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Category, Type, Product, LEGACY_TYPE_SLUGS } from '../src/lib/models.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// --- tiny .env.local loader (no dotenv dependency needed for one script) ---
function loadEnvLocal() {
  try {
    const content = readFileSync(join(root, '.env.local'), 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (key && !process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local not present — fine, MONGODB_URI might already be in the shell env
  }
}
loadEnvLocal();

const KEEP_PRODUCTS = process.argv.includes('--keep-products');

const CATEGORIES = [
  { name: 'Fruits & Vegetables', slug: 'fruits-vegetables', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80', description: 'Fresh, seasonal produce sourced daily.' },
  { name: 'Dairy & Eggs', slug: 'dairy-eggs', image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&q=80', description: 'Milk, cheese, yogurt and free-range eggs.' },
  { name: 'Bakery & Bread', slug: 'bakery-bread', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', description: 'Artisan breads and baked goods.' },
  { name: 'Pantry & Dry Goods', slug: 'pantry-dry-goods', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80', description: 'Oils, grains, sweeteners and staples.' },
  { name: 'Meat & Seafood', slug: 'meat-seafood', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80', description: 'Responsibly sourced meat and fish.' },
  { name: 'Beverages', slug: 'beverages', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80', description: 'Coffee, tea, juices and health drinks.' },
  { name: 'Snacks & Confectionery', slug: 'snacks-confectionery', image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&q=80', description: 'Sweet and savoury treats.' },
];

const TYPES = [
  { name: 'Flash Sale', slug: 'flash-sale', description: 'Time-limited discounted deals.', color: 'red' },
  { name: 'New Arrivals', slug: 'new-arrivals', description: 'Recently added to the catalogue.', color: 'violet' },
  { name: 'Featured', slug: 'featured', description: 'Hand-picked highlights.', color: 'violet' },
  { name: 'Best Seller', slug: 'best-seller', description: 'Our most popular products.', color: 'dark' },
  { name: 'Organic', slug: 'organic', description: 'Certified organic produce.', color: 'green' },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('✗ MONGODB_URI is not set. Add it to .env.local, then re-run this script.');
    process.exit(1);
  }

  console.log('Connecting to MongoDB…');
  await mongoose.connect(uri, { bufferCommands: false });
  console.log('✓ Connected\n');

  // --- Categories ---
  console.log('Seeding categories…');
  for (const cat of CATEGORIES) {
    await Category.findOneAndUpdate(
      { slug: cat.slug },
      { $set: cat, $setOnInsert: { isActive: true } },
      { upsert: true, new: true }
    );
  }
  console.log(`✓ ${CATEGORIES.length} categories ready\n`);

  // --- Types ---
  console.log('Seeding types…');
  for (const t of TYPES) {
    await Type.findOneAndUpdate(
      { slug: t.slug },
      { $set: t, $setOnInsert: { isActive: true } },
      { upsert: true, new: true }
    );
  }
  console.log(`✓ ${TYPES.length} types ready\n`);

  // --- Products ---
  if (KEEP_PRODUCTS) {
    console.log('--keep-products passed — skipping product seeding.\n');
  } else {
    console.log('Seeding demo products…');
    const productsPath = join(root, 'src', 'lib', 'products.json');
    const demoProducts = JSON.parse(readFileSync(productsPath, 'utf-8'));

    const existing = await Product.countDocuments();
    if (existing > 0) {
      console.log(`  Found ${existing} existing product(s) — clearing before reseed.`);
      await Product.deleteMany({});
    }

    const docs = demoProducts.map((p) => {
      // Translate legacy booleans into the new `types` array — this is the
      // same mapping the Product model itself uses to keep the two in sync
      // on every future save, so seeded data matches the live schema logic.
      const types = Object.entries(LEGACY_TYPE_SLUGS)
        .filter(([, flagField]) => p[flagField])
        .map(([slug]) => slug);

      const { id, ...rest } = p; // drop the demo-JSON id — Mongo assigns its own _id
      return { ...rest, types };
    });

    await Product.insertMany(docs);
    console.log(`✓ ${docs.length} products seeded\n`);
  }

  console.log('Done. Your MongoDB database is ready.');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('\n✗ Seed failed:', err.message);
  process.exit(1);
});
