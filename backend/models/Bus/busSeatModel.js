import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },

  seatTypes: {
    Seater: { type: [String], default: [] },
    Sleeper: { type: [String], default: [] },
    Upper: { type: [String], default: [] },
    Lower: { type: [String], default: [] },
  },

  prices: {
    Seater: { type: Number},
    Sleeper: { type: Number },
    Upper: { type: Number},
    Lower: { type: Number},
  },

  bookedSeatsByDate: {
    type: Map,
    of: [String],
    default: {}
  }

}, { timestamps: true });

export default mongoose.model('Seat', seatSchema);
