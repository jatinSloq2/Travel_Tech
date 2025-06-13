import React from "react";
import BookingRow from "./BookingRow";

const BookingTable = ({ bookings, onStatusUpdate }) => (
  <table className="w-full border-collapse border border-gray-300">
    <thead>
      <tr className="bg-gray-100">
        <th className="border px-4 py-2 text-left">Hotel</th>
        <th className="border px-4 py-2 text-left">Room</th>
        <th className="border px-4 py-2 text-left">Check-In</th>
        <th className="border px-4 py-2 text-left">Check-Out</th>
        <th className="border px-4 py-2 text-left">Guests</th>
        <th className="border px-4 py-2 text-left">Status</th>
        <th className="border px-4 py-2 text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      {bookings.map((booking) => (
        <BookingRow
          key={booking._id}
          booking={booking}
          onStatusUpdate={onStatusUpdate}
        />
      ))}
    </tbody>
  </table>
);

export default BookingTable;
