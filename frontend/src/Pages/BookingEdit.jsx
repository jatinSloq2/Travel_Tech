import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const BookinEdit = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form fields
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalGuests, setTotalGuests] = useState(1);
  const [totalRoomsBooked, setTotalRoomsBooked] = useState(1);
  const [manualRoomChange, setManualRoomChange] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axiosInstance.get(`/hotel/booking/${bookingId}`);
        if (res.data.success) {
          const b = res.data.booking;
          setBooking(b);
          setCheckIn(b.checkIn.slice(0, 10));
          setCheckOut(b.checkOut.slice(0, 10));
          setTotalGuests(b.totalGuests);
          setTotalRoomsBooked(b.totalRoomsBooked);
        } else {
          setError("Booking not found");
        }
      } catch (err) {
        setError("Error fetching booking");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);
  useEffect(() => {
    if (!manualRoomChange) {
      setTotalRoomsBooked(Math.ceil(totalGuests / 2));
    }
  }, [totalGuests, manualRoomChange]);

  const handleGuestsChange = (e) => {
    const guests = Number(e.target.value);
    if (guests < 1) return;
    setTotalGuests(guests);

    
    if (manualRoomChange && guests > totalRoomsBooked * 2) {
      setManualRoomChange(false);
    }
  };

  const handleRoomsChange = (e) => {
    const rooms = Number(e.target.value);
    if (rooms < 1) return;
    setTotalRoomsBooked(rooms);
    setManualRoomChange(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(`/hotel/user/booking/update/${bookingId}`, {
        checkIn,
        checkOut,
        totalGuests,
        totalRoomsBooked,
      });

      if (res.data.success) {
        alert("Booking updated successfully!");
      } else {
        alert(res.data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "An unexpected error occurred.");
    }
  };

  if (loading) return <p>Loading booking details...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Booking</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="checkIn" className="block font-medium">
            Check-In Date:
          </label>
          <input
            type="date"
            id="checkIn"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="checkOut" className="block font-medium">
            Check-Out Date:
          </label>
          <input
            type="date"
            id="checkOut"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="totalGuests" className="block font-medium">
            Total Guests:
          </label>
          <input
            type="number"
            id="totalGuests"
            min="1"
            value={totalGuests}
            onChange={handleGuestsChange}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="totalRoomsBooked" className="block font-medium">
            Total Rooms Booked:
          </label>
          <input
            type="number"
            id="totalRoomsBooked"
            min={Math.ceil(totalGuests / 2)}
            value={totalRoomsBooked}
            onChange={handleRoomsChange}
            required
            className="border rounded px-3 py-2 w-full"
          />
          <p className="text-sm text-gray-600 mt-1">
            Each room can accommodate 2 guests. Minimum rooms required:{" "}
            {Math.ceil(totalGuests / 2)}
          </p>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Booking
        </button>
      </form>
    </div>
  );
};

export default BookinEdit;
