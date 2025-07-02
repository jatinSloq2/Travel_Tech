import express from "express"
import { addFlightReview, deleteUserBooking, flightBooking, getAllAirport, getFlightById, getFlightsByFilter, validateFlightBookingInput } from "../controllers/flights.controller.js"
import { authenticateToken } from "../middlewares/authMiddleware.js"

const fliRouter = express.Router()

fliRouter.get("/airports", getAllAirport)
fliRouter.get("/search", getFlightsByFilter)
fliRouter.get("/flightdetail", getFlightById)
fliRouter.post("/booking/validate/flight",authenticateToken ,validateFlightBookingInput)
fliRouter.post("/booking",authenticateToken ,flightBooking)
fliRouter.post("/review/:targetId/:bookingId",authenticateToken ,addFlightReview)

export default fliRouter