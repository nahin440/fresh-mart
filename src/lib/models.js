import mongoose from 'mongoose';

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
  isFlashSale: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isOrganic: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

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
