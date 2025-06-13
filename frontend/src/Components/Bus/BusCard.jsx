import { ArrowRight, Circle, Clock, IndianRupee, MapPin } from "lucide-react";

const BusCard = ({ bus, onSelect }) => {
  const minPrice = bus.prices ? Math.min(...Object.values(bus.prices)) : "N/A";
  // console.log(bus);
  return (
    <div
      onClick={() => onSelect(bus)}
      className="bg-white border border-orange-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer p-5 flex flex-col md:flex-row justify-between gap-6 group hover:border-orange-400"
    >
      {/* Left Section */}
      <div className="flex flex-col justify-between flex-1 gap-4">
        {/* Operator and Type */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-orange-500 transition">
            {bus.operator || "Unknown Operator"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Type:{" "}
            <span className="font-medium text-gray-800">
              {Array.isArray(bus.busType)
                ? bus.busType.join(", ")
                : bus.busType || "N/A"}
            </span>
          </p>
        </div>

        <div className="overflow-x-auto whitespace-nowrap py-2 border-t border-b border-orange-200">
          {bus.route?.origin &&
          bus.route?.stops?.length > 0 &&
          bus.route?.destination ? (
            <>
              {/* Origin */}
              <span className="inline-flex items-center text-sm font-semibold text-orange-500 mr-3">
                <MapPin className="w-4 h-4 mr-1" />
                {bus.route.origin}
              </span>

              {/* Intermediate stops with stand details */}
              {bus.route.stops.slice(1, -1).map((stop, idx) => (
                <span
                  key={stop._id || idx}
                  className="inline-flex flex-col items-start text-gray-600 text-xs mr-3"
                >
                  <div className="flex items-center">
                    <Circle className="w-3 h-3 mr-1 text-orange-300" />
                    <span>{stop.city}</span>
                    <ArrowRight className="w-3 h-3 mx-2 text-orange-300" />
                  </div>
                  <div className="ml-4 text-gray-400 italic">{stop.stand}</div>
                </span>
              ))}

              {/* Destination */}
              <span className="inline-flex items-center text-sm font-semibold text-orange-500">
                <MapPin className="w-4 h-4 rotate-180 mr-1" />
                {bus.route.destination}
              </span>
            </>
          ) : (
            <p className="text-gray-400 text-xs italic">
              Route details not available
            </p>
          )}
        </div>

        {/* Travel time & Seats */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1 text-orange-500 font-semibold">
            <Clock className="w-4 h-4" />
            <span>{bus.totalTravelTime || "N/A"}</span>
          </div>

          <div>
            <span className="font-semibold">
              {bus.availableSeatsCount ?? bus.availableSeats?.length ?? 0}
            </span>{" "}
            seats left
          </div>

          <div>
            Total Seats:{" "}
            <span className="font-semibold">
              {bus.totalSeatsCount || bus.allSeats?.length || "N/A"}
            </span>
          </div>
        </div>

        {/* Seat Types */}
        <div className="flex flex-wrap gap-2">
          {bus.availableByType && typeof bus.availableByType === "object" ? (
            Object.entries(bus.availableByType)
              .filter(([_, seats]) => seats.length > 0)
              .map(([type, seats]) => (
                <span
                  key={type}
                  className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {type} ({seats.length})
                </span>
              ))
          ) : (
            <span className="text-gray-400 text-xs italic">
              Seat types not listed
            </span>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-end justify-center text-right md:items-end md:justify-center">
        <p className="text-sm text-gray-500 mb-1">Price Starts At</p>
        <p className="text-3xl font-bold text-orange-500 flex items-center gap-1">
          <IndianRupee className="w-6 h-6" /> {minPrice}
        </p>
      </div>
    </div>
  );
};

export default BusCard;
