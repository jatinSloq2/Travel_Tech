import mongoose from 'mongoose';

const trainReviewSchema = new mongoose.Schema({
  train: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
    required: true,
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainBooking',
    required: true,
  },
  user: {
    type: Number, 
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

// ✅ Ensure one review per booking
trainReviewSchema.index({ booking: 1 }, { unique: true });

const TrainBookingReview = mongoose.model('TrainBookingReview', trainReviewSchema);

export default TrainBookingReview;
