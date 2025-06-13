import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    flight: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FlightBooking',
        required: true,
    },
    user: {
        type: Number,
        required: true
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

reviewSchema.index({ booking: 1 }, { unique: true });

const FlightBookingReview = mongoose.model('FlightBookingReview', reviewSchema);

export default FlightBookingReview;
