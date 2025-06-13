import mongoose from 'mongoose';

const busReviewSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'BusBooking', required: true },
  userId: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
}, { timestamps: true });

// Ensure one review per booking per user to avoid duplicates
busReviewSchema.index({ booking: 1, userId: 1 }, { unique: true });

export default mongoose.model('BusReview', busReviewSchema);
