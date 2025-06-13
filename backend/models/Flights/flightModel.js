import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNo: {
    type: String,
    required: true,
    trim: true,
    uppercase: true, // Normalize seat numbers to uppercase
  }
}, { _id: false });

const seatTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Economy', 'Business', 'First'], // Restrict to known seat types
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Price should never be negative
  },
  seats: {
    type: [seatSchema],
    validate: {
      validator: v => Array.isArray(v) && v.length > 0,
      message: 'At least one seat must be specified in each seatType',
    }
  }
}, { _id: false });

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true, // Normalize for consistency
  },
  airline: {
    type: String,
    required: true,
    trim: true,
  },
  fromAirport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airport',
    required: true,
  },
  toAirport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airport',
    required: true,
    validate: {
      validator: function (value) {
        // Prevent same airport for from and to
        return value.toString() !== this.fromAirport.toString();
      },
      message: 'Destination airport must be different from origin airport'
    }
  },
  departureTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/, // Validate HH:mm format 24h time
  },
  arrivalTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    validate: {
      validator: function (value) {
        // Simple validation: arrival should not be equal to departure
        return value !== this.departureTime;
      },
      message: 'Arrival time must be different from departure time',
    }
  },
  operatingDays: [{
    type: String,
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    required: true,
  }],
  seatTypes: {
    type: [seatTypeSchema],
    validate: {
      validator: v => Array.isArray(v) && v.length > 0,
      message: 'At least one seatType must be specified',
    }
  },
  owner: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});
flightSchema.index(
  { flightNumber: 1, fromAirport: 1, toAirport: 1 },
  { unique: true }
);

// Additional indexes for common query optimizations
flightSchema.index({ fromAirport: 1, toAirport: 1 });
flightSchema.index({ airline: 1 });

flightSchema.virtual('durationMinutes').get(function () {
  const toMinutes = time => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };
  let diff = toMinutes(this.arrivalTime) - toMinutes(this.departureTime);
  if (diff < 0) diff += 24 * 60; 
  return diff;
});

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;
