import mongoose from 'mongoose';

// A Type's slug is what links it to the legacy boolean flags below (isFlashSale
// etc.) that the storefront (home sections, product cards, filters) already
// reads directly. Seeding or admin-creating a Type with one of these slugs
// means any product tagged with it keeps working everywhere on the site with
// zero changes to storefront components. Types with other slugs are supported
// too — they just won't have a legacy boolean counterpart.
export const LEGACY_TYPE_SLUGS = {
  'flash-sale': 'isFlashSale',
  'new-arrivals': 'isNewArrival',
  'featured': 'isFeatured',
  'best-seller': 'isBestSeller',
  'organic': 'isOrganic',
};

// Each homepage section is one of a fixed set of "kinds" (the bespoke,
// visually distinct sections already built — flash-sale, new-arrivals,
// featured, best-sellers, hero, category-strip, testimonials, trust,
// newsletter, banner) or "custom", a generic type/category-filtered product
// row that can be added any number of times with its own title and filter.
// `enabled` and `order` let admin toggle visibility and drag-reorder without
// touching any component code; `limit` controls how many products show.
const HomeSectionSchema = new mongoose.Schema({
  kind: { type: String, required: true }, // 'hero' | 'category-strip' | 'flash-sale' | 'new-arrivals' | 'featured' | 'best-sellers' | 'testimonials' | 'trust' | 'newsletter' | 'banner' | 'custom'
  title: String,            // display heading — used as-is for 'custom', ignored (bespoke copy) by most built-in kinds
  subtitle: String,
  limit: { type: Number, default: 8 },
  filterType: String,       // for 'custom' kind: a Type slug to filter products by (e.g. 'organic')
  filterCategory: String,   // for 'custom' kind: a Category name to filter products by, alternative to filterType
  enabled: { type: Boolean, default: true },
  order: { type: Number, required: true },
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  description: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const TypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String,
  color: { type: String, default: 'violet' }, // used for badge styling in admin UI
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  subcategory: String,
  price: { type: Number, required: true },
  originalPrice: Number,
  discount: Number,
  unit: String,
  weight: String,
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  description: String,
  highlights: [String],
  nutrition: {
    calories: Number, fat: String, carbs: String, protein: String, fiber: String
  },
  image: String,
  images: [String],
  tags: [String],
  // Canonical multi-select "type" field — an array of Type slugs (e.g.
  // ['organic', 'new-arrivals']). A product can carry any number of these.
  types: { type: [String], default: [] },
  // Legacy single-purpose flags, kept for backward compatibility with the
  // existing storefront. These are auto-derived from `types` in the pre-save
  // hook below — don't set them directly from admin UI, set `types` instead.
  isFlashSale: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isOrganic: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

ProductSchema.pre('save', function(next) {
  const types = Array.isArray(this.types) ? this.types : [];
  for (const [slug, flagField] of Object.entries(LEGACY_TYPE_SLUGS)) {
    this[flagField] = types.includes(slug);
  }
  next();
});

// findByIdAndUpdate/findOneAndUpdate bypass document middleware by default,
// so the same sync has to happen here too or admin edits made via PUT would
// silently stop updating the legacy flags.
ProductSchema.pre(['findOneAndUpdate'], function(next) {
  const update = this.getUpdate() || {};
  const nextTypes = update.types ?? update.$set?.types;
  if (nextTypes !== undefined) {
    const types = Array.isArray(nextTypes) ? nextTypes : [];
    const flags = {};
    for (const [slug, flagField] of Object.entries(LEGACY_TYPE_SLUGS)) {
      flags[flagField] = types.includes(slug);
    }
    if (update.$set) Object.assign(update.$set, flags);
    else Object.assign(update, flags);
  }
  next();
});

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: String,
    postcode: String,
    email: String,
  },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
  }],
  subtotal: Number,
  deliveryFee: Number,
  total: Number,
  status: { type: String, enum: ['pending','confirmed','preparing','dispatched','delivered','cancelled'], default: 'pending' },
  paymentMethod: { type: String, default: 'cod' },
  notes: String,
}, { timestamps: true });

OrderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'FM' + Date.now().toString().slice(-8);
  }
  next();
});

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const Type = mongoose.models.Type || mongoose.model('Type', TypeSchema);
export const HomeSection = mongoose.models.HomeSection || mongoose.model('HomeSection', HomeSectionSchema);
