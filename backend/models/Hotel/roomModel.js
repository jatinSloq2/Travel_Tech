import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  roomType: { type: String, required: true },  
  pricePerNight: { type: Number, required: true },
  capacity: { type: Number, required: true },      
  amenities: [String],
  totalRooms: { type: Number, required: true, min: 1 },
  images: [String], 
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);
