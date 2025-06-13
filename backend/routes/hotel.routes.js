import express from 'express'
import {  addBookingReview, createBooking, deleteUserBooking, getAllHotel, getHotelByID, getUserBookingById, hotelCity, updateBooking } from "../controllers/hotel.controller.js";
import { authenticateToken } from '../middlewares/authMiddleware.js';

const hotelRouter = express.Router()

hotelRouter.get("/cities", hotelCity)
hotelRouter.get('/hotels', getAllHotel);
hotelRouter.get('/hotels/:id', getHotelByID);
hotelRouter.post('/book',authenticateToken ,createBooking);
hotelRouter.get('/booking/:id',authenticateToken, getUserBookingById );
hotelRouter.put("/user/booking/update/:id", authenticateToken ,updateBooking)
hotelRouter.post('/review/:targetId/:bookingId',authenticateToken, addBookingReview);

export default hotelRouter