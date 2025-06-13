import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

const StationAutocomplete = ({
  query,
  setQuery,
  stations,
  placeholder = "Station",
}) => {
  const [filteredStations, setFilteredStations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setFilteredStations(
      stations.filter((station) =>
        station.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, stations]);

  const handleSelect = (name) => {
    setQuery(name);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 pointer-events-none" />

      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        onFocus={() => {
          if (query.length >= 2) setShowDropdown(true);
        }}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-800"
        autoComplete="off"
      />

      {showDropdown && filteredStations.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-orange-300 rounded-md max-h-48 overflow-auto mt-1 shadow-lg">
          {filteredStations.map((station, i) => (
            <li
              key={i}
              onMouseDown={() => handleSelect(station.name)}
              className="px-3 py-2 cursor-pointer hover:bg-orange-100 text-sm"
            >
              {station.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StationAutocomplete;
