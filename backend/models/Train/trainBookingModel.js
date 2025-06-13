import mongoose from 'mongoose';

const travelerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  train: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true },
  date: { type: Date, required: true },
  seatNo: { type: String, required: true },
  seatType: { type: String, required: true },
});

const trainBookingSchema = new mongoose.Schema({
  travelers: [travelerSchema],
  userId: { type: Number, required: true },
  status: { type: String, enum: ['Booked', 'Cancelled', 'Completed'], default: 'Booked' },
  totalAmount: { type: Number },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
}, { timestamps: true });

trainBookingSchema.index({ 'travelers.train': 1, 'travelers.date': 1, 'travelers.seatNo': 1 });

const TrainBooking = mongoose.model('TrainBooking', trainBookingSchema);

export default TrainBooking;