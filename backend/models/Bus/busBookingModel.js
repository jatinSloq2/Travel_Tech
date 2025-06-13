import mongoose from 'mongoose';

const travellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  seatNumber: { type: String, required: true }, // associate seat to traveller
});

const bookingSchema = new mongoose.Schema({
  userId: { type:Number, required: true }, 
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  journeyDate: { type: Date, required: true },

  travellers: { type: [travellerSchema], required: true },

  totalPassengers: { type: Number, required: true, default: 1 },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Booked', 'Cancelled', 'Completed'], default: 'Booked' },
}, { timestamps: true });

export default mongoose.model('BusBooking', bookingSchema);