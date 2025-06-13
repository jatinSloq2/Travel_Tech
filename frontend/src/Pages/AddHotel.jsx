import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addHotel } from "../Services/DashboardServices.js";

const AddHotel = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    images: "",
    amenities: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: form.name,
      location: form.location,
      description: form.description,
      images: form.images.split(",").map((img) => img.trim()),
      amenities: form.amenities.split(",").map((am) => am.trim()),
    };

    try {
      const newHotel = await addHotel(payload);

      setLoading(false);
      setForm({
        name: "",
        location: "",
        description: "",
        images: "",
        amenities: "",
      });
      alert("Hotel added successfully!");

      navigate(`/addroom/${newHotel._id}`);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to add hotel");
    }
  };

  return (
    <div
      className="
        min-h-[calc(100vh-6rem)] 
        flex flex-col justify-center 
        px-4 py-12
        max-w-3xl mx-auto
        bg-white rounded-lg shadow-md
        sm:px-6 lg:px-8 mt-10 mb-10
      "
      style={{ maxWidth: "720px" }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-8 border-b border-gray-300 pb-3">
        Add New Hotel
      </h2>

      {error && (
        <p className="text-red-600 bg-red-100 p-3 rounded mb-6">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          ></textarea>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Images (comma separated URLs)
          </label>
          <input
            type="text"
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="image1.jpg, image2.jpg"
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Amenities (comma separated)
          </label>
          <input
            type="text"
            name="amenities"
            value={form.amenities}
            onChange={handleChange}
            placeholder="Free WiFi, Pool, Spa"
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-md font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add Hotel"}
        </button>
      </form>
    </div>
  );
};

export default AddHotel;
