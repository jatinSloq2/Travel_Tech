import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  TablePagination,
} from "@mui/material";

import BookingTable from "../Components/VendorBooking/BookingTable";
import BusBookingTable from "../Components/VendorBooking/BusBookingTable";
import StatusFilter from "../Components/VendorBooking/StatusFilter";

const VendorBooking = () => {
  const [limit, setLimit] = useState(10);
  const [viewType, setViewType] = useState("hotel");

  const [hotelBookings, setHotelBookings] = useState([]);
  const [hotelLoading, setHotelLoading] = useState(false);
  const [hotelError, setHotelError] = useState(null);
  const [hotelPage, setHotelPage] = useState(0);
  const [hotelPages, setHotelPages] = useState(1);
  const [hotelStatusFilter, setHotelStatusFilter] = useState("");
  const [hotelStartDate, setHotelStartDate] = useState("");
  const [hotelEndDate, setHotelEndDate] = useState("");

  const [busBookings, setBusBookings] = useState([]);
  const [busLoading, setBusLoading] = useState(false);
  const [busError, setBusError] = useState(null);
  const [busPage, setBusPage] = useState(0);
  const [busPages, setBusPages] = useState(1);
  const [busStatusFilter, setBusStatusFilter] = useState("");
  const [busStartDate, setBusStartDate] = useState("");
  const [busEndDate, setBusEndDate] = useState("");

  const fetchHotelBookings = async () => {
    setHotelLoading(true);
    try {
      let url = `/dashboard/vendor/bookings?page=${hotelPage + 1}&limit=${limit}`;
      if (hotelStatusFilter) url += `&status=${hotelStatusFilter}`;
      if (hotelStartDate && hotelEndDate)
        url += `&startDate=${hotelStartDate}&endDate=${hotelEndDate}`;
      const res = await axiosInstance.get(url);
      if (res.data.success) {
        setHotelBookings(res.data.bookings);
        setHotelPages(res.data.pages);
      } else {
        setHotelError("Failed to fetch hotel bookings");
      }
    } catch {
      setHotelError("Error fetching hotel bookings");
    } finally {
      setHotelLoading(false);
    }
  };

  const fetchBusBookings = async () => {
    setBusLoading(true);
    try {
      let url = `/dashboard/vendor/bookings/bus?page=${busPage + 1}&limit=${limit}`;
      if (busStatusFilter) url += `&status=${busStatusFilter}`;
      if (busStartDate && busEndDate)
        url += `&startDate=${busStartDate}&endDate=${busEndDate}`;
      const res = await axiosInstance.get(url);
      if (res.data.success) {
        setBusBookings(res.data.bookings);
        setBusPages(res.data.pages);
      } else {
        setBusError("Failed to fetch bus bookings");
      }
    } catch {
      setBusError("Error fetching bus bookings");
    } finally {
      setBusLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const res = await axiosInstance.patch(`/dashboard/vendor/statusupdate/${bookingId}`, {
        status: newStatus,
      });
      if (res.data.success) {
        fetchHotelBookings();
        fetchBusBookings();
      } else {
        alert("Failed to update status.");
      }
    } catch {
      alert("Error updating status.");
    }
  };

  useEffect(() => {
    if (viewType === "hotel") fetchHotelBookings();
  }, [hotelPage, hotelStatusFilter, hotelStartDate, hotelEndDate, viewType]);

  useEffect(() => {
    if (viewType === "bus") fetchBusBookings();
  }, [busPage, busStatusFilter, busStartDate, busEndDate, viewType]);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Vendor Bookings
      </Typography>

      <ToggleButtonGroup
        value={viewType}
        exclusive
        onChange={(e, newView) => newView && setViewType(newView)}
        sx={{ mb: 3 }}
      >
        <ToggleButton value="hotel">Hotel Bookings</ToggleButton>
        <ToggleButton value="bus">Bus Bookings</ToggleButton>
      </ToggleButtonGroup>

      {viewType === "hotel" && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Hotel Bookings Filters
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
            <StatusFilter statusFilter={hotelStatusFilter} onChange={setHotelStatusFilter} />
            <TextField
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={hotelStartDate}
              onChange={(e) => setHotelStartDate(e.target.value)}
            />
            <TextField
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={hotelEndDate}
              onChange={(e) => setHotelEndDate(e.target.value)}
            />
          </Box>

          {hotelLoading ? (
            <CircularProgress />
          ) : hotelError ? (
            <Typography color="error">{hotelError}</Typography>
          ) : (
            <>
              <BookingTable bookings={hotelBookings} onStatusUpdate={handleStatusUpdate} />
              <TablePagination
                component="div"
                count={hotelPages * limit}
                page={hotelPage}
                onPageChange={(e, newPage) => setHotelPage(newPage)}
                rowsPerPage={limit}
                onRowsPerPageChange={(e) => {
                  setLimit(parseInt(e.target.value, 10));
                  setHotelPage(0);
                }}
              />
            </>
          )}
        </Box>
      )}

      {viewType === "bus" && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Bus Bookings Filters
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
            <StatusFilter statusFilter={busStatusFilter} onChange={setBusStatusFilter} />
            <TextField
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={busStartDate}
              onChange={(e) => setBusStartDate(e.target.value)}
            />
            <TextField
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={busEndDate}
              onChange={(e) => setBusEndDate(e.target.value)}
            />
          </Box>

          {busLoading ? (
            <CircularProgress />
          ) : busError ? (
            <Typography color="error">{busError}</Typography>
          ) : (
            <>
              <BusBookingTable bookings={busBookings} onStatusUpdate={handleStatusUpdate} />
              <TablePagination
                component="div"
                count={busPages * limit}
                page={busPage}
                onPageChange={(e, newPage) => setBusPage(newPage)}
                rowsPerPage={limit}
                onRowsPerPageChange={(e) => {
                  setLimit(parseInt(e.target.value, 10));
                  setBusPage(0);
                }}
              />
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default VendorBooking;
