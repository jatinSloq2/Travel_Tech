import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema({
  city: { type: String, required: true },         
  stand: { type: String, required: true },        
  arrivalTime: { type: String, required: true }, 
  departureTime: { type: String, default: null }  
});

const routeSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  stops: { type: [stopSchema], required: true }
}, { timestamps: true });

export default mongoose.model('Route', routeSchema);
