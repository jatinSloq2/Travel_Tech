import express from "express";
import { login, signup , logout, user, getUserBookings, getUserReviews, updateUserById, cancelUserBooking} from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get('/me',authenticateToken,user );
userRouter.post("/register", signup);
userRouter.get("/reviews",authenticateToken ,getUserReviews)
userRouter.get('/bookings',authenticateToken , getUserBookings);
userRouter.patch("/booking/:id/cancel", authenticateToken , cancelUserBooking)
userRouter.put("/update/profile", authenticateToken ,updateUserById )
export default userRouter;
