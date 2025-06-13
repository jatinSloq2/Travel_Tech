import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

import Filters from "../Components/Admin/Filters";
import SummaryCards from "../Components/Admin/SummaryCards";
import BookingGraph from "../Components/Admin/BookingGraph";
import BookingTable from "../Components/Admin/BookingTable";

const STATUS_OPTIONS = ["All", "confirmed", "cancelled", "completed"];
const PAGE_SIZE = 5;

const AdminBooking = () => {
  const [ownerId, setOwnerId] = useState("");
  const [owners, setOwners] = useState([]);
  const [status, setStatus] = useState("All");
  const [dateRange, setDateRange] = useState("last30");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [bookings, setBookings] = useState({
    hotelBookings: [],
    busBookings: [],
    flightBookings: [],
    trainBookings: [],
  });

  const [counts, setCounts] = useState({
    hotel: 0,
    bus: 0,
    flight: 0,
    train: 0,
    total: 0,
  });

  const [amounts, setAmounts] = useState({
    hotel: 0,
    bus: 0,
    flight: 0,
    train: 0,
    total: 0,
  });

  // Pagination state for each type
  const [pageNumbers, setPageNumbers] = useState({
    hotel: 1,
    bus: 1,
    flight: 1,
    train: 1,
  });

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await axiosInstance.get("/admin/users?role=VENDOR");
        setOwners(res.data?.users || []);
      } catch (err) {
        console.error("Failed to fetch owners", err);
      }
    };

    fetchOwners();
  }, []);
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};

      if (ownerId) params.ownerId = ownerId;
      if (status && status !== "All") params.status = status;

      console.log("Final params to backend:", params);

      const response = await axiosInstance.get("/admin/bookings", { params });

      const {
        hotelBookings,
        busBookings,
        flightBookings,
        trainBookings,
        counts,
        amounts,
      } = response.data;

      setBookings({
        hotelBookings,
        busBookings,
        flightBookings,
        trainBookings,
      });
      setCounts(counts);
      setAmounts(amounts);

      // Reset pagination after new fetch
      setPageNumbers({ hotel: 1, bus: 1, flight: 1, train: 1 });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to load bookings data.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on filter changes
  useEffect(() => {
    fetchBookings();
  }, [ownerId, status, dateRange, customStart, customEnd]);

  // Pagination handler
  const handlePageChange = (type, page) => {
    setPageNumbers((prev) => ({ ...prev, [type]: page }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-semibold text-center mb-8">
        Admin Booking Dashboard
      </h1>

      <Filters
        owners={owners}
        ownerId={ownerId}
        setOwnerId={setOwnerId}
        status={status}
        setStatus={setStatus}
        STATUS_OPTIONS={STATUS_OPTIONS}
      />

      {loading ? (
        <p className="text-center text-gray-600">Loading bookings...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <>
          <SummaryCards counts={counts} amounts={amounts} />
          <BookingGraph counts={counts} amounts={amounts} />

          <section>
            <h3 className="text-xl font-semibold mb-4">Hotel Bookings</h3>
            <BookingTable
              bookings={bookings.hotelBookings}
              type="hotel"
              currentPage={pageNumbers.hotel}
              onPageChange={(page) => handlePageChange("hotel", page)}
            />

            <h3 className="text-xl font-semibold mt-10 mb-4">Bus Bookings</h3>
            <BookingTable
              bookings={bookings.busBookings}
              type="bus"
              currentPage={pageNumbers.bus}
              onPageChange={(page) => handlePageChange("bus", page)}
            />

            <h3 className="text-xl font-semibold mt-10 mb-4">
              Flight Bookings
            </h3>
            <BookingTable
              bookings={bookings.flightBookings}
              type="flight"
              currentPage={pageNumbers.flight}
              onPageChange={(page) => handlePageChange("flight", page)}
            />

            <h3 className="text-xl font-semibold mt-10 mb-4">Train Bookings</h3>
            <BookingTable
              bookings={bookings.trainBookings}
              type="train"
              currentPage={pageNumbers.train}
              onPageChange={(page) => handlePageChange("train", page)}
            />
          </section>
        </>
      )}
    </div>
  );
};

export default AdminBooking;
