import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Search,
  CalendarDays,
  Users,
  BedDouble,
  IndianRupee,
  MapPin,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const HotelFilter = ({
  searchCity,
  searchPrice,
  searchCheckIn,
  searchCheckOut,
  searchGuests,
  searchRooms,
  onCityChange,
  onPriceChange,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onRoomsChange,
  onSearch,
  onClear,
}) => {
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axiosInstance.get("/hotel/cities");
        setCitySuggestions(res.data);
      } catch (err) {
        console.error("Failed to fetch cities:", err.message);
      }
    };
    fetchCities();
  }, []);

  const filteredCities = citySuggestions.filter((city) =>
    city.toLowerCase().includes(searchCity.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      onSearch();
    }, 100);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl border border-orange-100 rounded-xl p-8 mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 items-end"
    >
      {/* City */}
      <div className="relative w-full">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
          <input
            type="text"
            value={searchCity}
            onChange={(e) => {
              onCityChange(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="City or Hotel"
            className="w-full pl-10 pr-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        {showSuggestions && filteredCities.length > 0 && (
          <ul className="absolute z-20 w-full bg-white border border-orange-200 rounded-md shadow-md mt-1 max-h-48 overflow-y-auto">
            {filteredCities.map((city, index) => (
              <li
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  onCityChange(city);
                  setShowSuggestions(false);
                }}
                className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
              >
                {city}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Check-in */}
      <div className="relative w-full">
        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 pointer-events-none" />
        <DatePicker
          selected={searchCheckIn}
          onChange={onCheckInChange}
          placeholderText="Check-in"
          dateFormat="yyyy-MM-dd"
          className="w-full pl-10 pr-3 py-2 border border-orange-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Check-out */}
      <div className="relative w-full">
        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 pointer-events-none" />
        <DatePicker
          selected={searchCheckOut}
          onChange={onCheckOutChange}
          placeholderText="Check-out"
          dateFormat="yyyy-MM-dd"
          className="w-full pl-10 pr-3 py-2 border border-orange-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Guests */}
      <div className="relative w-full">
        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
        <select
          value={searchGuests}
          onChange={onGuestsChange}
          className="w-full pl-10 pr-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">Guests</option>
          {[1, 2, 3, 4, 5].map((g) => (
            <option key={g} value={g}>
              {g} Guest{g > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Rooms */}
      <div className="relative w-full">
        <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
        <select
          value={searchRooms}
          onChange={onRoomsChange}
          className="w-full pl-10 pr-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">Rooms</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} Room{r > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          onClick={() => {
            onSearch();
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          <Search className="w-4 h-4" /> Search
        </button>
      </div>
    </form>
  );
};

export default HotelFilter;
