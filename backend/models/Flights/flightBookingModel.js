import mongoose from 'mongoose';

const travelerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
  date: { type: Date, required: true },
  seatNo: { type: String, required: true },
  seatType: { type: String, required: true },
});

const flightBookingSchema = new mongoose.Schema({
  travelers: [travelerSchema],
  userId: { type: Number, required: true },
  status: { type: String, enum: ['Booked', 'Cancelled', 'Completed'], default: 'Booked' },
  totalAmount: { type: Number },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
}, { timestamps: true });

// Index to optimize querying travelers by flight and seat
flightBookingSchema.index({ 'travelers.flight': 1, 'travelers.date': 1, 'travelers.seatNo': 1 });

const FlightBooking = mongoose.model('FlightBooking', flightBookingSchema);

export default FlightBooking;
