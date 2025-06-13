import express from "express"
import { cancelBooking, createBooking, getAllCities, getTrainById, getTrains } from "../controllers/train.controller.js"
import { authenticateToken } from "../middlewares/authMiddleware.js"

const trainRouter = express.Router()

trainRouter.get("/stations", getAllCities)
trainRouter.get("/", getTrains)
trainRouter.post("/booking", authenticateToken, createBooking)
trainRouter.get("/traindetail", getTrainById)
trainRouter.patch("/booking/cancel/:id", authenticateToken, cancelBooking)

export default trainRouter