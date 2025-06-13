import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config()

const mongoConnection = mongoose.connect(process.env.MONGO_DB_URL)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

export default mongoConnection;
