import React, { useState } from "react";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";

const HotelCard = ({ hotel, onClick }) => {
  const {
    name,
    location,
    description,
    rating = 0,
    reviewCount = 0,
    images = [],
    minRoomPrice,
  } = hotel;

  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 overflow-hidden flex flex-col md:flex-row"
    >
      {/* Left Image Section */}
      <div className="md:w-1/3 w-full">
        {/* Main Image */}
        <div className="w-full h-40 md:h-54">
          <img
            src={mainImage}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnails */}
        <div className="flex space-x-2 px-2 py-2 overflow-x-auto bg-gray-50">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              onClick={(e) => {
                e.stopPropagation(); 
                setMainImage(img);
              }}
              alt={`thumb-${idx}`}
              className={`h-12 w-16 object-cover rounded border-2 cursor-pointer transition ${
                img === mainImage
                  ? "border-orange-500"
                  : "border-transparent hover:border-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Info Section */}
      <div className="p-4 flex flex-col justify-between md:w-2/3">
        {/* Top Info */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{name}</h3>
          <p className="text-sm text-gray-500 flex items-center mb-2">
            <FaMapMarkerAlt className="mr-1 text-orange-500" /> {location}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {description}
          </p>
        </div>

        {/* Bottom Info */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            <span className="font-medium text-yellow-600 flex items-center">
              <FaStar className="mr-1 text-yellow-500" /> {rating.toFixed(1)}
            </span>
            <p className="text-xs text-gray-400">{reviewCount} reviews</p>
          </div>

          <div>
            <p className="text-lg font-bold text-orange-600">
              ₹{minRoomPrice.toLocaleString()}
              <span className="text-sm text-gray-500 font-normal ml-1">
                / night
              </span>
            </p>
            <button className="mt-2 px-4 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
