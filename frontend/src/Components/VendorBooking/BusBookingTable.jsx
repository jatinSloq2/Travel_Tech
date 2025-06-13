import React from 'react';

const BusBookingTable = ({ bookings, onStatusUpdate }) => {
  if (!bookings || bookings.length === 0) {
    return <p>No bookings found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b">Booking ID</th>
            <th className="px-4 py-2 border-b">User ID</th>
            <th className="px-4 py-2 border-b">Journey Date</th>
            <th className="px-4 py-2 border-b">Travellers</th>
            <th className="px-4 py-2 border-b">Total Passengers</th>
            <th className="px-4 py-2 border-b">Total Amount</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b break-all">{booking._id}</td>
              <td className="px-4 py-2 border-b">{booking.userId}</td>
              <td className="px-4 py-2 border-b">{new Date(booking.journeyDate).toLocaleDateString()}</td>
              <td className="px-4 py-2 border-b">
                {booking.travellers.map(t => (
                  <div key={t._id} className="text-sm">
                    {t.name} (Seat: {t.seatNumber}, Age: {t.age})
                  </div>
                ))}
              </td>
              <td className="px-4 py-2 border-b text-center">{booking.totalPassengers}</td>
              <td className="px-4 py-2 border-b text-right">₹{booking.totalAmount}</td>
              <td className="px-4 py-2 border-b">
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold ${
                    booking.status === 'Booked' ? 'bg-green-200 text-green-800' :
                    booking.status === 'Cancelled' ? 'bg-red-200 text-red-800' :
                    'bg-gray-200 text-gray-800'
                  }`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="px-4 py-2 border-b text-center">
                {/* Example: button to toggle status */}
                {booking.status !== 'Cancelled' && (
                  <button
                    onClick={() => onStatusUpdate(booking._id, 'Cancelled')}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusBookingTable;
