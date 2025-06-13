import { useState } from "react";
import { useParams } from "react-router-dom";
import { addRoom } from "../Services/DashboardServices.js";

const AddRoom = () => {
  const { hotelId } = useParams();

  const [roomData, setRoomData] = useState({
    roomType: "",
    price: "",
    capacity: "",
    amenities: "",
    images: "",
    totalRooms: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await addRoom(roomData, hotelId);

    setLoading(false);

    if (result.success) {
      alert("Room added successfully!");
      setRoomData({
        roomType: "",
        price: "",
        capacity: "",
        amenities: "",
        images: "",
        totalRooms: "",
      });
    } else {
      setError(result.message);
    }
  };

  return (
    <div
      className="max-w-lg mx-auto p-6 bg-white rounded shadow"
      style={{ marginTop: "3rem", marginBottom: "3rem" }}
    >
      <h2 className="text-xl font-semibold mb-4">Add Room to Hotel</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Room Type */}
        <div>
          <label className="block mb-1 font-medium">Room Name</label>
          <input
            name="roomType"
            value={roomData.roomType}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            name="price"
            type="number"
            value={roomData.price}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block mb-1 font-medium">Capacity</label>
          <input
            name="capacity"
            type="number"
            value={roomData.capacity}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Total Rooms */}
        <div>
          <label className="block mb-1 font-medium">Total Rooms</label>
          <input
            name="totalRooms"
            type="number"
            value={roomData.totalRooms}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Amenities */}
        <div>
          <label className="block mb-1 font-medium">
            Amenities (comma separated)
          </label>
          <input
            name="amenities"
            value={roomData.amenities}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block mb-1 font-medium">
            Images (comma separated URLs)
          </label>
          <input
            name="images"
            value={roomData.images}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Adding Room..." : "Add Room"}
        </button>
      </form>
    </div>
  );
};

export default AddRoom;
