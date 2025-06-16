import {
  ArrowRight,
  Clock,
  IndianRupeeIcon,
  MapPin,
  Plane,
} from "lucide-react";

import React from "react";

const FlightCard = ({ flight, onClick }) => {
  const getMinPriceOfLeg = (leg) => {
    if (!leg.seatTypes || leg.seatTypes.length === 0) return 0;
    return Math.min(...leg.seatTypes.map((st) => st.price));
  };

  const minPrice =
    flight.legs && flight.legs.length > 0
      ? flight.legs.reduce((sum, leg) => sum + getMinPriceOfLeg(leg), 0)
      : "N/A";

  const availableClasses = [
    ...new Set(
      flight.legs.flatMap((leg) => leg.seatTypes?.map((st) => st.type) || [])
    ),
  ];

  return (
    <div
      onClick={() => onClick?.()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="bg-white border border-orange-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer p-4 sm:p-5 flex flex-col md:flex-row justify-between gap-4 sm:gap-6 hover:border-orange-400"
    >
      {/* Left Section */}
      <div className="flex flex-col justify-between gap-4 flex-1 min-w-0">
        {/* Airline and Flight Numbers */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-orange-500 transition">
            {flight.legs.map((leg) => leg.airline).join(" → ") ||
              "Unknown Airline"}
          </h2>
          <p className="text-sm text-gray-600 mt-1 break-words">
            Flight Number(s):{" "}
            <span className="font-medium text-gray-800">
              {flight.legs.map((leg) => leg.flightNumber).join(" → ") || "N/A"}
            </span>
          </p>
        </div>

        {/* Route */}
       <div className="border-t border-b border-orange-200 py-3 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6 text-gray-700 font-semibold overflow-x-auto no-scrollbar">
  {flight.legs.map((leg, idx) => {
    let haltTime = null;
    if (idx < flight.legs.length - 1) {
      const toMinutes = (t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      const currentArrival = leg.arrivalTime;
      const nextDeparture = flight.legs[idx + 1].departureTime;
      if (currentArrival && nextDeparture) {
        const diff = toMinutes(nextDeparture) - toMinutes(currentArrival);
        if (diff > 0) {
          if (diff < 60) {
            haltTime = `${diff} min`;
          } else {
            const hours = Math.floor(diff / 60);
            const minutes = diff % 60;
            haltTime = `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
          }
        }
      }
    }

    return (
      <React.Fragment key={leg._id || idx}>
        {/* One leg display */}
        <span className="inline-flex items-center gap-4 sm:gap-6 whitespace-normal">
          <div className="flex flex-col items-center text-center min-w-[72px] sm:min-w-[80px]">
            <div className="flex items-center gap-1 text-orange-400 text-sm sm:text-base">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{leg.fromAirport?.code || leg.fromAirport?.city || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1 text-orange-600 text-xs mt-1">
              <Clock className="w-3 h-3" />
              <span>Dep: {leg.departureTime || "N/A"}</span>
            </div>
          </div>

          <Plane className="w-5 h-5 text-orange-400 rotate-90 mx-1 sm:mx-2" />

          <div className="flex flex-col items-center text-center min-w-[72px] sm:min-w-[80px]">
            <div className="flex items-center gap-1 text-orange-400 text-sm sm:text-base">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{leg.toAirport?.code || leg.toAirport?.city || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1 text-orange-600 text-xs mt-1">
              <Clock className="w-3 h-3" />
              <span>Arr: {leg.arrivalTime || "N/A"}</span>
            </div>
          </div>

          {/* Arrow only for sm and up */}
          {idx < flight.legs.length - 1 && (
            <ArrowRight className="w-4 h-4 text-orange-400 mx-2 hidden sm:inline" />
          )}
        </span>

        {/* Halt time only between legs */}
        {haltTime && idx < flight.legs.length - 1 && (
          <span className="text-xs italic text-gray-500 mt-1 sm:mt-0 sm:ml-2 sm:inline hidden">
            Stop: {haltTime}
          </span>
        )}

        {/* Mobile-specific halt (on new line) */}
        {haltTime && idx < flight.legs.length - 1 && (
          <span className="text-xs italic text-gray-500 sm:hidden block text-center w-full">
            Stop: {haltTime}
          </span>
        )}
      </React.Fragment>
    );
  })}
</div>


        {/* Classes */}
        <div className="flex flex-wrap gap-2">
          {availableClasses.length > 0 ? (
            availableClasses.map((cls) => (
              <span
                key={cls}
                className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold"
              >
                {cls}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs italic">
              Class info not listed
            </span>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-end justify-center text-right shrink-0">
        <p className="text-sm text-gray-500 mb-1">Min Price</p>
        <p className="text-2xl sm:text-3xl font-bold text-orange-500 flex items-center gap-1">
          <IndianRupeeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          {minPrice !== "N/A" ? minPrice.toLocaleString("en-IN") : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default FlightCard;
