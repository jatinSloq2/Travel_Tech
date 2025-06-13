import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  train: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
    required: true,
  },

  class: {
    type: String,
    enum: ['SL', '3A', '2A', '1A'],
    required: true,
  },

  totalSeats: {
    type: Number,
    required: true,
  },

  seats: [
    {
      seatNumber: {
        type: String,
        required: true,
      },

      bookings: [
        {
          date: {
            type: String, 
            required: true,
          },
          isBooked: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
}, {
  timestamps: true,
});

export default mongoose.model('TrainSeat', seatSchema);
