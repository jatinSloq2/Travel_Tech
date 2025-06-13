import mongoose from 'mongoose';

const trainSchema = new mongoose.Schema({
  // Unique train number and name
  trainNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  // Days of the week the train operates
  operatingDays: [
    {
      type: String,
      enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
  ],

  // Common route ID shared between UP and DOWN direction of the same route
  routeId: { type: String, required: true },

  // Direction of the train: UP = source → destination, DOWN = destination → source
  direction: {
    type: String,
    enum: ['UP', 'DOWN'],
    required: true,
  },

  // Full route: array of stations with timing and distance details
  route: [
    {
      station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required: true,
      },
      arrivalTime: String,       // Format: "HH:MM"
      departureTime: String,     // Format: "HH:MM"
      distance: Number,          // Distance from source in KM
      dayOffset: Number,         // +1 if train arrives next day, etc.
    },
  ],

  // Available seat classes with their capacity and fare
  seatTypes: [
    {
      class: {
        type: String,
        enum: ['SL', '3A', '2A', '1A'], // SL = Sleeper, 3A = AC 3-Tier, etc.
        required: true,
      },
      totalSeats: { type: Number, required: true },
      fare: { type: Number, required: true },
    },
  ],
owner : {type : Number ,default : 32}
  ,
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export default mongoose.model('Train', trainSchema);
