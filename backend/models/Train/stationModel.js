import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // e.g. NDLS
  name: { type: String, required: true },               // e.g. New Delhi
  city: String,
  state: String,
});

export default mongoose.model('Station', stationSchema);