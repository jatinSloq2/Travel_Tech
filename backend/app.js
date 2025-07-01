import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


import './db/connectionMongoDB.js';
import './db/connectionMYSQL.js'


import userRouter from './routes/user.routes.js';
import hotelRouter from './routes/hotel.routes.js';
import dashRouter from './routes/dashboard.routes.js';
import busRouter from './routes/bus.routes.js';
import fliRouter from './routes/flights.routes.js';
import trainRouter from './routes/train.routes.js';
import adminRouter from './routes/admin.routes.js';
import packRouter from './routes/packages.routes.js';
import payRouter from './routes/payment.routes.js';


const app = express();

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));


app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/hotel", hotelRouter);
app.use("/api/bus", busRouter);
app.use("/api/flight", fliRouter);
app.use("/api/train", trainRouter)
app.use("/api/dashboard/vendor", dashRouter);
app.use("/api/admin", adminRouter)
app.use("/api/payment", payRouter)
app.use("/api/package", packRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not hit found' });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`The site is live at http://localhost:${port}`);
});
