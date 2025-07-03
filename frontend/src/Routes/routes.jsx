import React from "react";
import { createBrowserRouter } from "react-router-dom";
//-----------------------------------------------------
import OpenRoutes from "./OpenRoutes";
import Flights from "../Pages/Flights";
import Trains from "../Pages/Trains"; // Open Routes Import
import Buses from "../Pages/Buses";
import Packages from "../Pages/Packages";
import Hotels from "../Pages/Hotels";
import HotelDetails from "../Pages/HotelDetails";
//-----------------------------------------------------
import ProtectedRoutes from "./ProtectedRoutes";
import Wishlist from "../Pages/Wishlist"; //User Routes Import
import MyTrips from "../Pages/MyTrips";
//-----------------------------------------------------
import VendorListing from "../Pages/VendorListing";
import VendorBooking from "../Pages/VendorBooking"; //Vendor Routes Import
//-----------------------------------------------------
import AdminBooking from "../Pages/AdminBooking";
import AdminUser from "../Pages/AdminUser"; //Admin Routes Import
import AdminListing from "../Pages/AdminListing";
//-----------------------------------------------------
import Profile from "../Pages/Profile";// All user Routes
//-----------------------------------------------------
import UnprotectedRoutes from "./UnprotectedRoutes";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import ForgetPassword from "../Pages/ForgetPassword";
import AddHotel from "../Pages/AddHotel";
import AddRoom from "../Pages/AddRoom";
import VendorEditHotel from "../Pages/VendorEditHotel";
import VendorEditRoom from "../Pages/VendorEditRoom";
import BookinEdit from "../Pages/BookingEdit";
import VendorEditBooking from "../Pages/VendorEditBooking";
import VendorDashboard from "../Pages/VendorDashboard";
import AddBus from "../Pages/AddBus";
import EditBus from "../Pages/EditBus";
import PackageDetail from "../Pages/PackageDetail";
import PaymentSuccess from "../Pages/PaymentSuccess";
import PaymentRoutes from "./PaymentsRoutes";
import PaymentCancelled from "../Pages/PaymentCancelled";
//-----------------------------------------------------

const routes = createBrowserRouter([
  // Public Routes
  {
    element: <OpenRoutes />,
    children: [
      { path: "/hotels", element: <Hotels /> },
       { path: "/hotels/:id", element: <HotelDetails /> },
      { path: "/", element: <Flights /> },
      { path: "/trains", element: <Trains /> },
      { path: "/buses", element: <Buses /> },
      { path: "/packages", element: <Packages /> },
      { path: "/packages/:id", element: <PackageDetail /> },
    ],
  },

  // Admin Protected Routes
  {
    element: <ProtectedRoutes allowedRoles={["ADMIN"]} />,
    children: [
      { path: "/admin/users", element: <AdminUser /> },
      { path: "/admin/bookings", element: <AdminBooking /> },
      { path: "/admin/listings", element: <AdminListing /> },
    ],
  },

  // Vendor Protected Routes
  {
    element: <ProtectedRoutes allowedRoles={["VENDOR"]} />,
    children: [
      { path: "/vendor/listings", element: <VendorListing /> },
      { path: "/vendor/booking", element: <VendorBooking /> },
      {path : "/vendor/booking/edit/:id", element : <VendorEditBooking/>},
      {path:"/edithotel/:id", element: <VendorEditHotel/>},
     {path:"/editroom/:roomId", element: <VendorEditRoom/>},
     {path:"/vendor/hotel/add", element: <AddHotel/>},
     {path:"/addroom/:hotelId" , element: <AddRoom /> },
     {path: "/vendor/bus/add", element : <AddBus/>}, 
     {path: "/vendor/bus/edit/:busId", element : <EditBus/>}
    ],
  },

  // User Protected Routes
  {
    element: <ProtectedRoutes allowedRoles={["USER"]} />,
    children: [
      { path: "/my-trips", element: <MyTrips /> },
      { path: "/wishlist", element: <Wishlist /> },
      {path: "/my-trips/update/hotel/:bookingId", element: <BookinEdit/>},
      {path: "/my-trips/update/bus/:bookingId"}
    ],
  },

  // Profile Route (Available to All Roles)
  {
    element: <ProtectedRoutes allowedRoles={["ADMIN", "VENDOR", "USER"]} />,
    children: [{ path: "/profile", element: <Profile /> }],
  },

  // Dashboard Route (Available to VENDOR and ADMIN)
  {
    element: <ProtectedRoutes allowedRoles={["ADMIN", "VENDOR"]} />,
    children: [
    
     { path: "/dashboard", element: <VendorDashboard /> },
     
     
    ],
  },

  // Auth Pages (Public for Unauthenticated Users)
  {
    element: <UnprotectedRoutes />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/forgot-password", element: <ForgetPassword /> },
    ],
  },
  {
    element: <PaymentRoutes allowedRoles={["ADMIN", "VENDOR", "USER"]}/>,
    children : [
      { path: "/payment-success", element: <PaymentSuccess /> },
      { path: "/payment-cancelled", element: <PaymentCancelled/>},
    ]
  },
]);

export default routes;
