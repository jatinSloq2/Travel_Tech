import express from "express"
import { addBookingReview, addBusWithDetails, cancelBooking, createBooking, getAllBuses, getBusByID, getCities, getUserBookingById, updateBusByID, validateBusBookingInput } from "../controllers/bus.controller.js"
import { authenticateToken } from "../middlewares/authMiddleware.js"
import { authorizeRoles } from "../middlewares/authorizeRoles.js"

const busRouter = express.Router()

busRouter.get("/buses",getAllBuses )
busRouter.get("/cities", getCities)
busRouter.get("/bus/:id", getBusByID)

busRouter.post("/booking/validate/bus",authenticateToken, validateBusBookingInput );
busRouter.post("/booking",authenticateToken, createBooking );
busRouter.put("/bus/edit/:id",authenticateToken ,authorizeRoles('VENDOR', 'ADMIN') ,updateBusByID);
busRouter.post("/add", authenticateToken ,authorizeRoles('VENDOR', 'ADMIN'), addBusWithDetails);

busRouter.get('/booking/:id',authenticateToken, getUserBookingById);
busRouter.post('/review/:targetId/:bookingId',authenticateToken, addBookingReview);



export default busRouter