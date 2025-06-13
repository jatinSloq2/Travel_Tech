import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';

const VendorEditBooking = () => {
  const { id } = useParams(); // booking ID from URL
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
    totalGuests: '',
    totalRoomsBooked: '',
    status: '',
  });

 const fetchBooking = async () => {
  try {
    const { data } = await axiosInstance.get(`/hotel/booking/${id}`);
    console.log(data);
    const bookingData = data.booking;

    setBooking(bookingData);
    setForm({
      checkIn: bookingData.checkIn.slice(0, 10),
      checkOut: bookingData.checkOut.slice(0, 10),
      totalGuests: bookingData.totalGuests,
      totalRoomsBooked: bookingData.totalRoomsBooked,
      status: bookingData.status,
    });
  } catch (error) {
    console.error('Failed to fetch booking', error);
  }
};

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(`/dashboard/vendor/update/${id}`, form);
      alert(res.data.message);
      navigate('/vendor/booking');
    } catch (error) {
      console.error('Error updating booking:', error);
      alert(error.response?.data?.message || 'Error updating booking.');
    }
  };

  if (!booking) return <div>Loading booking data...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border shadow rounded bg-white dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-semibold mb-6">Edit Booking (Admin)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Check-In Date</label>
          <input type="date" name="checkIn" value={form.checkIn} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">Check-Out Date</label>
          <input type="date" name="checkOut" value={form.checkOut} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">Total Guests</label>
          <input type="number" name="totalGuests" value={form.totalGuests} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">Total Rooms Booked</label>
          <input type="number" name="totalRoomsBooked" value={form.totalRoomsBooked} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border px-3 py-2 rounded">
            <option value="Booked">Booked</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Booking
        </button>
      </form>
    </div>
  );
};

export default VendorEditBooking;
