import React from "react";

const BookingRow = ({ booking, onStatusUpdate }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="border px-4 py-2">{booking.hotel?.name}</td>
      <td className="border px-4 py-2">{booking.room?.roomType}</td>
      <td className="border px-4 py-2">{new Date(booking.checkIn).toLocaleDateString()}</td>
      <td className="border px-4 py-2">{new Date(booking.checkOut).toLocaleDateString()}</td>
      <td className="border px-4 py-2">{booking.totalGuests}</td>
      <td className="border px-4 py-2 capitalize">
        <span className="font-semibold">{booking.status}</span>
        {booking.status === "Booked" && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => onStatusUpdate(booking._id, "Completed")}
              className="text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-sm"
            >
              Complete
            </button>
            <button
              onClick={() => onStatusUpdate(booking._id, "Cancelled")}
              className="text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </td>
      <td className="border px-4 py-2">
        <a
          href={`/vendor/booking/edit/${booking._id}`}
          className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-sm"
        >
          Edit
        </a>
      </td>
    </tr>
  );
};

export default BookingRow;
