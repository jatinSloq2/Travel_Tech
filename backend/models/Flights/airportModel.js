// models/Airport.js
import mongoose from 'mongoose';

const airportSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true },
    code:   { type: String, required: true, unique: true },  
    city:   { type: String, required: true },
    country:{ type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Airport', airportSchema);
