import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchHotelById, updateHotelById } from "../Services/DashboardServices.js";

const VendorEditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [hotel, setHotel] = useState({
    name: "",
    location: "",
    description: "",
    images: [""],
    amenities: [""],
  });

  useEffect(() => {
    const loadHotel = async () => {
      const result = await fetchHotelById(id);
      if (result.success) {
        const { name, location, description, images, amenities } = result.hotel;
        setHotel({
          name: name || "",
          location: location || "",
          description: description || "",
          images: images?.length ? images : [""],
          amenities: amenities?.length ? amenities : [""],
        });
      } else {
        alert(result.message);
      }
      setLoading(false);
    };
    loadHotel();
  }, [id]);

  const handleChange = (e) => {
    setHotel({ ...hotel, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...hotel[field]];
    updated[index] = value;
    setHotel({ ...hotel, [field]: updated });
  };

  const handleAddField = (field) => {
    setHotel({ ...hotel, [field]: [...hotel[field], ""] });
  };

  const handleRemoveField = (field, index) => {
    const updated = hotel[field].filter((_, i) => i !== index);
    setHotel({ ...hotel, [field]: updated.length ? updated : [""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateHotelById(id, hotel);
    if (result.success) {
      alert("Hotel updated successfully");
      navigate("/vendor/listings");
    } else {
      alert(result.message);
    }
  };

  if (loading)
    return <div className="text-center py-10 text-lg">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Edit Hotel
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hotel Name */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Hotel Name
          </label>
          <input
            type="text"
            name="name"
            value={hotel.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={hotel.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={hotel.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>

        {/* Images */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Image URLs
          </label>
          {hotel.images.map((img, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={img}
                onChange={(e) =>
                  handleArrayChange("images", idx, e.target.value)
                }
                placeholder="Image URL"
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveField("images", idx)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 rounded transition"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField("images")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition"
          >
            + Add Image
          </button>
        </div>

        {/* Amenities */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Amenities
          </label>
          {hotel.amenities.map((amenity, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={amenity}
                onChange={(e) =>
                  handleArrayChange("amenities", idx, e.target.value)
                }
                placeholder="Amenity"
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveField("amenities", idx)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 rounded transition"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField("amenities")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition"
          >
            + Add Amenity
          </button>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Update Hotel
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorEditHotel;
