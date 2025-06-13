import bcryptjs from "bcryptjs";
import { insertUser, getUserWithPasswordByEmail, getUserById, checkEmailExists, updateUserInDb } from "../db/query/userQueries.js";
import jwt from "jsonwebtoken";
import Route from "../models/Bus/busRouteModel.js"
import BusReview from "../models/Bus/busReviewModel.js";
import Review from "../models/Hotel/reviewModel.js";
import Airport from "../models/Flights/airportModel.js"
import FlightBookingReview from "../models/Flights/flightReviewModel.js"
import TrainBookingReview from "../models/Train/trainBookingModel.js"
import UnifiedBooking from "../models/booking.js"


const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
};

export const user = async (req, res) => {
    try {
        const user = await getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log(user)
        res.json({ user });
    } catch (error) {
        console.error("Error in /user/me:", error.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await getUserWithPasswordByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.user_id, role: user.role, first_name: user.first_name,last_name: user.last_name , email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie('token', token, cookieOptions);
        res.json({ message: "Login success" });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ error: "Authentication failed" });
    }
};
export const logout = (req, res) => {
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({ message: "Logged out successfully" });
};
export const signup = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone, role } = req.body;

        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        await insertUser({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone,
            role,
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Signup error:", err.message);
        res.status(500).json({ error: "Registration failed" });
    }
};
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const allBookings = await UnifiedBooking.find({ user: userId })
      .populate("details.hotel")
      .populate("details.room")
      .populate("details.bus")
      .populate("details.route")
      .populate("details.travelers.flight")
      .populate({
        path: "details.travelers.train",
        populate: {
          path: "route.station",
          model: "Station",
          select: "name code city",
        },
      })
      .lean();

    const hotelBookings = [];
    const busBookings = [];
    const flightBookings = [];
    const trainBookings = [];

    // ⚙️ Preload needed data
    const allRoutes = await Route.find({}).lean();
    const routeMap = new Map();
    allRoutes.forEach(route => {
      if (route.bus) routeMap.set(route.bus.toString(), route);
    });

    const allAirports = await Airport.find({}).lean();
    const airportMap = allAirports.reduce((map, airport) => {
      map[airport._id.toString()] = { city: airport.city, code: airport.code };
      return map;
    }, {});

    for (const booking of allBookings) {
      const { bookingType, details } = booking;

      switch (bookingType) {
        case "hotel":
          hotelBookings.push(booking);
          break;

        case "bus":
          const route = routeMap.get(details.bus?._id?.toString()) || null;
          busBookings.push({ ...booking, route });
          break;

        case "flight":
          const travelersWithFlights = (details.travelers || []).map(traveler => {
            const flight = traveler.flight;
            if (!flight) return traveler;

            const {
              flightNumber,
              airline,
              fromAirport,
              toAirport,
              departureTime,
              arrivalTime,
              duration,
            } = flight;

            const from = airportMap[fromAirport?.toString()] || { city: "Unknown", code: "XXX" };
            const to = airportMap[toAirport?.toString()] || { city: "Unknown", code: "XXX" };

            return {
              ...traveler,
              flightDetails: {
                flightNumber,
                airline,
                fromAirport: `${from.city} (${from.code})`,
                toAirport: `${to.city} (${to.code})`,
                departureTime,
                arrivalTime,
                duration,
              },
            };
          });

          flightBookings.push({
            ...booking,
            details: {
              ...details,
              travelers: travelersWithFlights,
            },
          });
          break;

        case "train":
          const traveler = details.travelers?.[0];
          if (!traveler || !traveler.train) {
            trainBookings.push({
              ...booking,
              train: undefined,
              trainName: "Train",
              source: "Unknown",
              destination: "Unknown",
              journeyDate: traveler?.date || undefined,
            });
            break;
          }

          const train = traveler.train;
          const routeWithStationNames = (train.route || []).map((stop, idx) => {
            const station = stop.station || {};
            return {
              stationName: station.name || "Unknown",
              stationCode: station.code || "---",
              city: station.city || "Unknown",
              arrivalTime: stop.arrivalTime,
              departureTime: stop.departureTime,
              distance: stop.distance,
              dayOffset: stop.dayOffset,
            };
          });

          trainBookings.push({
            ...booking,
            trainName: train.name,
            train: {
              trainNumber: train.trainNumber,
              direction: train.direction,
              operatingDays: train.operatingDays,
              seatTypes: train.seatTypes,
              route: routeWithStationNames,
            },
            source: routeWithStationNames[0]?.stationName || "Unknown",
            destination: routeWithStationNames[routeWithStationNames.length - 1]?.stationName || "Unknown",
            journeyDate: traveler.date,
          });
          break;

        default:
          break;
      }
    }

    return res.status(200).json({
      success: true,
      bookings: {
        hotel: hotelBookings,
        bus: busBookings,
        flight: flightBookings,
        train: trainBookings,
      },
    });

  } catch (error) {
    console.error("❌ Error fetching user bookings:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const cancelUserBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;
    const booking = await UnifiedBooking.findOne({ _id: bookingId, user: userId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This booking is already cancelled.",
      });
    }

    const now = new Date();
    let journeyDate = null;
    switch (booking.bookingType) {
      case "hotel":
        journeyDate = new Date(booking.details?.checkIn);
        break;
      case "bus":
        journeyDate = new Date(booking.details?.journeyDate);
        break;
      case "flight":
      case "train":
        journeyDate = new Date(booking.details?.travelers?.[0]?.date);
        break;
    }

    if (journeyDate && journeyDate < now) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel past bookings.",
      });
    }

    booking.status = "cancelled";
    booking.cancellationDate = now;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
    });

  } catch (error) {
    console.error("❌ Error cancelling booking:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getUserReviews = async (req, res) => {
    const userId = req.user.id;
    try {
        const busReviews = await BusReview.find({ userId });
        const hotelReviews = await Review.find({ userId });
        const flightReviews = await FlightBookingReview.find({ user: userId });
        const trainReviews = await TrainBookingReview.find({ user: userId })

        return res.status(200).json({
            success: true,
            reviews: {
                bus: busReviews,
                hotel: hotelReviews,
                flight: flightReviews,
                train: trainReviews
            },
        });
    } catch (error) {
        console.error("Failed to fetch user reviews", error);
        res.status(500).json({ message: "Server error fetching reviews" });
    }
};
export const updateUserById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, phone, email } = req.body;

    if (!first_name?.trim() || !phone?.trim()) {
      return res.status(400).json({ message: "First name and phone are required." });
    }

    const updatedUser = await updateUserInDb({
      userId,
      first_name,
      last_name,
      phone,
      email,
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);

    // Check if this is the cooldown error (custom message)
    if (error.message.includes("Cannot update profile twice within 10 days")) {
      return res.status(429).json({ message: error.message });
    }

    // Other validation errors
    if (
      error.message === "User ID is required" ||
      error.message === "No fields provided for update" ||
      error.message === "User not found"
    ) {
      return res.status(400).json({ message: error.message });
    }

    // Fallback: server error
    return res.status(500).json({ message: "Server error while updating profile." });
  }
};





