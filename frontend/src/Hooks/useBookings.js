import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/user/bookings");

      // HOTEL BOOKINGS
      const hotelBookings = (res.data.bookings.hotel || []).map((booking) => ({
        _id: booking._id,
        type: "hotel",
        hotel: booking.details?.hotel,
        hotelName: booking.details?.hotel?.name || "Hotel",
        hotelImage: booking.details?.hotel?.images?.[0] || "",
        room: booking.details?.room?.roomType || "Room",
        amount: booking.details?.totalAmount || 0,
        checkIn: booking.details?.checkIn,
        checkOut: booking.details?.checkOut,
        totalGuests: booking.details?.totalGuests,
        roomsBooked: booking.details?.totalRoomsBooked || 1,
        status: booking.status || "confirmed",
        createdAt: booking.createdAt,
      }));

      // BUS BOOKINGS
      const busBookings = (res.data.bookings.bus || []).map((booking) => ({
        _id: booking._id,
        type: "bus",
        bus: booking.details?.bus,
        busName: booking.details?.bus?.name || "Bus",
        busType: (booking.details?.bus?.busType || []).join(", "),
        source: booking.route?.origin || "Unknown",
        destination: booking.route?.destination || "Unknown",
        amount: booking.details?.amount || booking.details?.totalAmount || 0,
        journeyDate: booking.details?.journeyDate,
        status: booking.status || "booked",
        createdAt: booking.createdAt,
      }));

      // FLIGHT BOOKINGS
      const flightBookings = (res.data.bookings.flight || []).map((booking) => {
        const flightsMap = new Map();

        (booking.details?.travelers || []).forEach((traveler) => {
          const flightId = traveler.flight?._id || traveler.flight;
          if (!flightsMap.has(flightId)) {
            flightsMap.set(flightId, {
              flight: traveler.flight,
              date: traveler.date,
              travelers: [],
            });
          }
          flightsMap.get(flightId).travelers.push(traveler);
        });

        return {
          _id: booking._id,
          type: "flight",
          flights: Array.from(flightsMap.values()),
          status: booking.status || "CONFIRMED",
          amount: booking.details?.amount,
          paymentStatus: booking.paymentStatus,
          createdAt: booking.createdAt,
        };
      });

      // TRAIN BOOKINGS
      const trainBookings = (res.data.bookings.train || []).map((booking) => ({
        _id: booking._id,
        type: "train",
        train: booking.train,
        trainName: booking.trainName || "Train",
        source: booking.source || "Unknown",
        destination: booking.destination || "Unknown",
        journeyDate: booking.journeyDate,
        travelers: booking.details?.travelers || [],
        amount: booking.details?.amount || booking.details?.totalAmount || 0,
        status: booking.status || "BOOKED",
        createdAt: booking.createdAt,
      }));

      // COMBINED
      const combinedBookings = [
        ...hotelBookings,
        ...busBookings,
        ...flightBookings,
        ...trainBookings,
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setBookings(combinedBookings);
    } catch (err) {
      console.error("❌ Failed to fetch bookings:", err);
      setErrorMessage(err.response?.data?.message || "Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return { bookings, loading, errorMessage, fetchBookings };
};
