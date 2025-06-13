import express from "express"
import { getAllBookings, getAllListings, getAllUsers } from "../controllers/admin.controller.js"
import { authenticateToken } from "../middlewares/authMiddleware.js"
import { authorizeRoles } from "../middlewares/authorizeRoles.js"

const adminRouter = express.Router()


adminRouter.get("/users", authenticateToken, authorizeRoles("ADMIN"), getAllUsers)
adminRouter.get("/listings", authenticateToken, authorizeRoles("ADMIN"), getAllListings)
adminRouter.get("/bookings",authenticateToken ,authorizeRoles("ADMIN") ,getAllBookings)


export default adminRouter