import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  booking : { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }, 
  userId: { type: Number, required: true }, 
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true }
}, { timestamps: true });

reviewSchema.index({ booking: 1, userId: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
