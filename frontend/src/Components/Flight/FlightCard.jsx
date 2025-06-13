import {
  ArrowRight,
  Clock,
  IndianRupeeIcon,
  MapPin,
  Plane,
} from "lucide-react";

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


  const airlineLogos = {
  "IndiGo": "https://yourcdn.com/logos/indigo.png",
  "Air India": "https://yourcdn.com/logos/air-india.png",
  "SpiceJet": "https://yourcdn.com/logos/spicejet.png",
  "Vistara": "https://yourcdn.com/logos/vistara.png",
  "GoAir": "https://yourcdn.com/logos/goair.png",
  // Add more mappings here
};

  return (
    <div
      onClick={() => {
        onClick && onClick();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick && onClick();
        }
      }}
      className="bg-white border border-orange-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer p-5 flex flex-col md:flex-row justify-between gap-6 group hover:border-orange-400"
    >
      {/* Left Section */}
      <div className="flex flex-col justify-between flex-1 gap-4">
        {/* Airline(s) and Flight Number(s) */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-orange-500 transition">
            {flight.legs.map((leg) => leg.airline).join(" → ") ||
              "Unknown Airline"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Flight Number(s):{" "}
            <span className="font-medium text-gray-800">
              {flight.legs.map((leg) => leg.flightNumber).join(" → ") || "N/A"}
            </span>
          </p>
        </div>

        {/* Route */}
        <div className="overflow-x-auto whitespace-nowrap py-2 border-t border-b border-orange-200 flex items-center gap-6 text-gray-700 font-semibold">
          {flight.legs.map((leg, idx) => {
            let haltTime = null;
            if (idx < flight.legs.length - 1) {
              const currentArrival = leg.arrivalTime;
              const nextDeparture = flight.legs[idx + 1].departureTime;

              const toMinutes = (t) => {
                const [h, m] = t.split(":").map(Number);
                return h * 60 + m;
              };

              if (currentArrival && nextDeparture) {
                const diff =
                  toMinutes(nextDeparture) - toMinutes(currentArrival);
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
              <span
                key={leg._id || idx}
                className="inline-flex items-center gap-6 whitespace-normal"
              >
                <div className="flex flex-col items-center text-center min-w-[80px]">
                  <div className="flex items-center gap-1 text-orange-400">
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold">
                      {leg.fromAirport?.code || leg.fromAirport?.city || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-600 text-xs mt-1">
                    <Clock className="w-3 h-3 translate-y-[1px]" />
                    <span>Dep: {leg.departureTime || "N/A"}</span>
                  </div>
                </div>

                <Plane className="w-6 h-6 text-orange-400 rotate-90 mx-2" />

                <div className="flex flex-col items-center text-center min-w-[80px]">
                  <div className="flex items-center gap-1 text-orange-400">
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold">
                      {leg.toAirport?.code || leg.toAirport?.city || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-600 text-xs mt-1 leading-none">
                    <Clock className="w-3 h-3 translate-y-[1px]" />
                    <span>Arr: {leg.arrivalTime || "N/A"}</span>
                  </div>
                </div>

                {haltTime !== null && (
                  <span className="text-gray-500 italic text-xs ml-4 whitespace-nowrap">
                    Stop: {haltTime}
                  </span>
                )}

                {idx < flight.legs.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-orange-400 mx-4" />
                )}
              </span>
            );
          })}
        </div>

        {/* Available Seat Classes */}
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

      {/* Right Section: Price */}
      <div className="flex flex-col items-end justify-center text-right md:items-end md:justify-center">
        <p className="text-sm text-gray-500 mb-1">Min Price</p>
        <p className="text-3xl font-bold text-orange-500 flex items-center gap-1">
          <IndianRupeeIcon className="w-6 h-6" />
          {minPrice !== "N/A" ? minPrice.toLocaleString("en-IN") : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default FlightCard;
