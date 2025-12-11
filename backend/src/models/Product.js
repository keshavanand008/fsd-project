import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  images: [{ type: String }],
  specs: {
    storage: String,
    ram: String,
    color: String,
    condition: { type: String, enum: ['new', 'like-new', 'used', 'for-parts'], default: 'used' }
  },
  stock: { type: Number, default: 0 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
