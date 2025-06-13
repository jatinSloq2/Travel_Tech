import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  owner: { type: Number, required: true },
  operator: { type: String, required: true },
  busNumber: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number']
  },
  busType: {
    type: [String],
    enum: ['AC', 'Non-AC', 'Sleeper', 'Seater'],
    required: true
  },
  totalSeats: { type: Number, required: true },
  amenities: [String],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },

  runningDays: [{
    type: String,
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    required: true
  }],

  departureTime: { type: String, required: true },  
  arrivalTime: { type: String, required: true },  

}, { timestamps: true });

export default mongoose.model('Bus', busSchema);
