// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: Number,  required: true },
  bookingType: {
    type: String,
    enum: ["flight", "train", "bus", "hotel", "package"],
    required: true,
  },
  bookingDate: { type: Date, default: Date.now },
  travelDate: { type: Date },
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "completed"],
    default: "confirmed",
  },

  // Common fields
  amount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["paid", "pending", "failed"],
    default: "pending",
  },

  // Booking-specific details
  details: {
    type: mongoose.Schema.Types.Mixed, 
    required: true,
  },
});

export default mongoose.model("UnifiedBooking", bookingSchema);
