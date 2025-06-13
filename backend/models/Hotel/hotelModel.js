import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  owner: { type: Number, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  images: [String],
  amenities: [String],
  rating: { type: Number, default: 0 }, 
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Hotel', hotelSchema);
