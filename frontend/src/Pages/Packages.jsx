import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { CalendarDays, Search, MapPin, Map } from "lucide-react";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

const Packages = () => {
  const navigate = useNavigate();
  const [packageType, setPackageType] = useState("single");
  const [city, setCity] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    try {
      const params = { type: packageType };

      if (packageType === "single") {
        if (!city) return alert("Please enter a city.");
        params.city = city;
      } else {
        if (!from || !to) return alert("Please enter both starting and ending cities.");
        params.from = from;
        params.to = to;
      }

      if (departureDate) params.departureDate = departureDate;

      setSearching(true);
      const res = await axiosInstance.get("/package/search", { params });
      setResults(res.data.packages || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Search Travel Packages</h2>

      {/* Package Type Switch */}
      <div className="mb-5">
        <span className="font-medium text-gray-700 mr-4">Package Type:</span>
        <button
          onClick={() => setPackageType("single")}
          className={`px-4 py-2 mr-2 rounded-lg transition duration-150 ${
            packageType === "single"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Single City
        </button>
        <button
          onClick={() => setPackageType("multi")}
          className={`px-4 py-2 rounded-lg transition duration-150 ${
            packageType === "multi"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Multi-City
        </button>
      </div>

      {/* Search Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="bg-white border border-orange-100 rounded-xl shadow-xl p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
      >
        {/* City / From */}
        <div className="col-span-12 md:col-span-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 pointer-events-none" />
            <input
              type="text"
              placeholder={packageType === "single" ? "City" : "From City"}
              value={packageType === "single" ? city : from}
              onChange={(e) =>
                packageType === "single"
                  ? setCity(e.target.value)
                  : setFrom(e.target.value)
              }
              className="w-full pl-10 pr-3 py-2 border border-orange-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* To (Multi only) */}
        {packageType === "multi" && (
          <div className="col-span-12 md:col-span-4">
            <div className="relative">
              <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 pointer-events-none" />
              <input
                type="text"
                placeholder="To City"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-orange-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Date Picker */}
        <div className="col-span-12 md:col-span-2">
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 pointer-events-none" />
            <DatePicker
              selected={departureDate ? new Date(departureDate) : null}
              onChange={(date) => {
                const formatted = date.toISOString().split("T")[0];
                setDepartureDate(formatted);
              }}
              placeholderText="Departure Date"
              className="w-full pl-10 pr-3 py-2 border border-orange-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="col-span-12 md:col-span-2">
          <button
            type="submit"
            disabled={searching}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-60"
          >
            {searching ? (
              <>
                <Search className="w-4 h-4 animate-spin" /> Searching…
              </>
            ) : (
              <>
                <Search className="w-4 h-4" /> Search
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="mt-8">
        {results.length > 0 ? (
          <ul className="space-y-4">
  {results.map((pkg) => (
    <li
      key={pkg._id}
      onClick={() => navigate(`/packages/${pkg._id}`)} // ⬅️ Redirect to details
      className="cursor-pointer border border-orange-100 p-4 rounded-lg shadow hover:shadow-md transition hover:bg-orange-50"
    >
      <h3 className="text-lg font-semibold text-gray-800">{pkg.name}</h3>
      <p className="text-gray-600">{pkg.itinerary?.[0]?.city || "N/A"}</p>
      <p className="text-sm text-gray-500">{pkg.packageType}</p>
    </li>
  ))}
</ul>
        ) : (
          <p className="text-gray-500 text-center">No packages found. Try different filters.</p>
        )}
      </div>
    </div>
  );
};

export default Packages;
