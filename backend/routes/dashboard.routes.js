import express from "express"
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { addHotel, addRoom, allListingsByVendor, deleteBus, deleteHotel, deleteRoom, getRoomById, getVendorBusBookings, getVendorBuses, getVendorHotelBookings, getVendorHotels, inventory, inventoryBus, recentReviews, recentReviewsBus, upcomingBookings, upcomingBookingsBus,updateHotel, updateRoom, vendorAnalyticsBooking, vendorAnalyticsBookingBus } from "../controllers/VendorDashboard.controller.js";


const dashRouter = express.Router()
//-----------------------------------------------------------------------------------------------------
dashRouter.get("/hotels", authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), getVendorHotels);
dashRouter.get("/analytics/bookings", authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), vendorAnalyticsBooking);
dashRouter.get("/bookings/upcoming", authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), upcomingBookings);
dashRouter.get("/reviews/recent", authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), recentReviews);
dashRouter.get("/inventory", authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), inventory);
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
dashRouter.get("/buses", authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), getVendorBuses);
dashRouter.get("/bus/analytics/bookings", authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), vendorAnalyticsBookingBus);
dashRouter.get("/bus/bookings/upcoming", authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), upcomingBookingsBus);
dashRouter.get("/bus/reviews/recent", authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), recentReviewsBus)
dashRouter.get("/inventory/bus", authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), inventoryBus);
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
dashRouter.post('/addhotel', authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), addHotel);
dashRouter.post("/addroom", authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), addRoom)
dashRouter.delete('/deletehotel/:id', authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), deleteHotel);
dashRouter.delete('/room/deleteroom/:id', authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), deleteRoom);
dashRouter.put("/updatehotel/:id", authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), updateHotel);
dashRouter.get("/room/:id", authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), getRoomById)
dashRouter.put('/room/update/:id', authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), updateRoom)
//-----------------------------------------------------------------------------------------------------
dashRouter.get('/my-listings', authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), allListingsByVendor);

dashRouter.get("/bookings", authenticateToken, authorizeRoles('VENDOR', 'ADMIN') ,getVendorHotelBookings); 
dashRouter.get("/bookings/bus", authenticateToken, authorizeRoles('VENDOR', 'ADMIN') ,getVendorBusBookings);

dashRouter.delete("/bus/delete/:id",authenticateToken, authorizeRoles('VENDOR', 'ADMIN'), deleteBus )


export default dashRouter