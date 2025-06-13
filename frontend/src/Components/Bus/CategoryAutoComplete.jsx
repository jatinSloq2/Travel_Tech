import React, { useState } from "react";
import { MapPin } from "lucide-react";

const CityAutocompleteInput = ({ name, value, onChange, placeholder, cities }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const filteredCities =
    value.length >= 2
      ? cities.filter((city) =>
          city.toLowerCase().startsWith(value.toLowerCase())
        )
      : [];

  const handleSelect = (city) => {
    onChange({ target: { name, value: city } });
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
      <input
        name={name}
        value={value}
        onChange={(e) => {
          onChange(e);
          setShowDropdown(true);
        }}
        onBlur={() => {
          setTimeout(() => setShowDropdown(false), 150);
        }}
        onFocus={() => {
          if (value.length >= 2) setShowDropdown(true);
        }}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
        autoComplete="off"
      />
      {showDropdown && filteredCities.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-orange-300 rounded-md max-h-48 overflow-auto mt-1 shadow-lg">
          {filteredCities.map((city) => (
            <li
              key={city}
              className="px-3 py-2 cursor-pointer hover:bg-orange-100"
              onMouseDown={() => handleSelect(city)} 
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityAutocompleteInput