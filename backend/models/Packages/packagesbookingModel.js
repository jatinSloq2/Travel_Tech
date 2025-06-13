import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const TravelerSchema = new Schema({
  fullName: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ["male", "female", "other"] },
  passportNumber: String,
  nationality: String,
});

const PaymentSchema = new Schema({
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  method: {
    type: String,
    enum: ["card", "upi", "netbanking", "wallet", "cash"],
  },
  transactionId: String,
  amountPaid: Number,
  currency: { type: String, default: "INR" },
  paidAt: Date,
  refundAmount: Number,
  refundReason: String,
});

const HotelRoomDetailsSchema = new Schema({
  roomType: String,
  capacity: Number,
  amenities: [String],
  checkIn: Date,
  checkOut: Date,
  images: [String],
});

const BookedComponentSchema = new Schema({
  type: {
    type: String,
    enum: ["flight", "hotel", "train", "bus", "activity", "transfer"],
    required: true,
  },
  referenceId: {
    type: Types.ObjectId,
    refPath: "bookedComponents.type",
    required: true,
  },
  roomId: {
    type: Types.ObjectId,
  },
  bookingId: String,
  name: String,
  location: String,
  dateTime: Date,
  status: {
    type: String,
    enum: ["booked", "cancelled", "pending", "failed"],
    default: "pending",
  },
  price: Number,

  // Only populated if type is "hotel"
  hotelDetails: {
    type: HotelRoomDetailsSchema,
    default: undefined, // included only when needed
  },
});

const BookingSchema = new Schema({
  package: {
    type: Types.ObjectId,
    ref: "Package",
    required: true,
  },
  user: {
    type: Number,
    required: true,
  },
  travelers: [TravelerSchema],
  travelClass: {
    type: String,
    enum: ["economy", "premium", "business", "luxury"],
  },
  groupSize: Number,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  payment: PaymentSchema,
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  cancellationPolicy: {
    type: String,
    enum: ['free', 'moderate', 'strict', 'non-refundable'],
    default: 'moderate',
  },
  bookedComponents: [BookedComponentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

export default mongoose.model("PackageBooking", BookingSchema);
