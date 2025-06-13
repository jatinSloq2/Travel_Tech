import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRoomById, updateRoomById } from "../Services/DashboardServices.js";

const VendorEditRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState({
    roomType: "",
    pricePerNight: "",
    capacity: "",
    amenities: [""],
    totalRooms: ""
  });

  useEffect(() => {
    const loadRoom = async () => {
      const result = await fetchRoomById(roomId); 
      if (result.success) {
        const { roomType, pricePerNight, capacity, amenities, totalRooms } = result.room;
        setRoom({
          roomType: roomType || "",
          pricePerNight: pricePerNight || "",
          capacity: capacity || "",
          amenities: amenities?.length > 0 ? amenities : [""],
          totalRooms: totalRooms || ""
        });
      } else {
        alert(result.message);
      }
    };

    loadRoom();
  }, [roomId]);

  const handleChange = (e) => {
    setRoom({ ...room, [e.target.name]: e.target.value });
  };

  const handleAmenityChange = (index, value) => {
    const updated = [...room.amenities];
    updated[index] = value;
    setRoom({ ...room, amenities: updated });
  };

  const handleAddAmenity = () => {
    setRoom({ ...room, amenities: [...room.amenities, ""] });
  };

  const handleRemoveAmenity = (index) => {
    const updated = room.amenities.filter((_, i) => i !== index);
    setRoom({ ...room, amenities: updated.length ? updated : [""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateRoomById(roomId, room); 
    if (result.success) {
      alert("Room updated successfully");
      navigate("/vendor/listings");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Room Type */}
        <div>
          <label className="block mb-1 font-semibold">Room Type</label>
          <input
            type="text"
            name="roomType"
            value={room.roomType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-semibold">Price per Night</label>
          <input
            type="number"
            name="pricePerNight"
            value={room.pricePerNight}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block mb-1 font-semibold">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={room.capacity}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Total Rooms */}
        <div>
          <label className="block mb-1 font-semibold">Total Rooms</label>
          <input
            type="number"
            name="totalRooms"
            value={room.totalRooms}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Amenities */}
        <div>
          <label className="block mb-1 font-semibold">Amenities</label>
          {room.amenities.map((amenity, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={amenity}
                onChange={(e) => handleAmenityChange(idx, e.target.value)}
                placeholder="Amenity"
                className="flex-grow border p-2 rounded"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveAmenity(idx)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddAmenity}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Amenity
          </button>
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
        >
          Update Room
        </button>
      </form>
    </div>
  );
};

export default VendorEditRoom;
