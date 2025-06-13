import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  name : {type : String,required: true  },
  owner: { type: Number, required: true }, 
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  totalRoomsBooked: { type: Number, required: true, default: 1 },
  totalGuests: { type: Number, required: true, default: 1 },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Booked', 'Cancelled', 'Completed'], default: 'Booked' },
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: null }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);