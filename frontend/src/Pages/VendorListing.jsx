import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHotel } from "../Context/HotelContext";

import HotelCard from "../Components/VendorListing/HotelCard";
import TopBar from "../Components/VendorListing/TopBar";

import { deleteHotel, deleteRoom } from "../Services/DashboardServices.js";
import BusCard from "../Components/VendorListing/BusCard.jsx";
import axiosInstance from "../utils/axiosInstance.jsx";

const VendorListing = () => {
  const { state, fetchListings } = useHotel();
  const { listings, loading, error } = state;

  const [expandedRooms, setExpandedRooms] = useState({});
  const [view, setView] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDeleteHotel = async (hotelId) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      const result = await deleteHotel(hotelId);
      if (result.success) fetchListings();
      else alert(result.message);
    }
  };

  const handleDeleteRoom = async (roomId, hotelId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      const result = await deleteRoom(roomId, hotelId);
      if (result.success) fetchListings();
      else alert(result.message);
    }
  };

  const toggleRoom = (roomId) => {
    setExpandedRooms((prev) => ({ ...prev, [roomId]: !prev[roomId] }));
  };

  const handleDeleteBus = async (id) => {
    if (window.confirm("Are you sure you want to delete this bus?")) {
      try {
        await axiosInstance.delete(`/dashboard/vendor/bus/delete/${id}`);
        fetchListings();
      } catch (error) {
        console.error("Error deleting bus:", error);
        alert("Failed to delete bus.");
      }
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-600">{error}</div>;

  const { hotels = [], buses = [], routes = [] } = listings || {};

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <TopBar
        onAddHotel={() => navigate("/vendor/hotel/add")}
        onAddBus={() => navigate("/vendor/bus/add")}
      />

      {/* View Selector */}
      <div className="mb-8 flex items-center space-x-4">
        <label htmlFor="view-select" className="font-semibold">
          Show:
        </label>
        <select
          id="view-select"
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All</option>
          <option value="hotels">Hotels</option>
          <option value="buses">Buses</option>
        </select>
      </div>

      {/* Hotels */}
      {(view === "all" || view === "hotels") && (
        <>
          <h2 className="text-2xl font-semibold mb-6">Hotels</h2>
          <ul className="space-y-10">
            {hotels.length > 0 ? (
              hotels.map((hotel) => (
                <HotelCard
                  key={hotel._id}
                  hotel={hotel}
                  onDeleteHotel={handleDeleteHotel}
                  onDeleteRoom={handleDeleteRoom}
                  navigate={navigate}
                  expandedRooms={expandedRooms}
                  toggleRoom={toggleRoom}
                />
              ))
            ) : (
              <p>No hotels found.</p>
            )}
          </ul>
        </>
      )}

      {/* Buses */}
      {(view === "all" || view === "buses") && (
        <>
          <h2 className="text-2xl font-semibold my-6">Buses</h2>
          <ul className="space-y-6">
            {buses.length > 0 ? (
              buses.map((bus) => (
                <BusCard
                  key={bus._id}
                  bus={bus}
                  routes={routes}
                  onEdit={() => navigate(`/vendor/bus/edit/${bus._id}`)}
                  onDelete={() => handleDeleteBus(bus._id)}
                />
              ))
            ) : (
              <p>No buses found.</p>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default VendorListing;
