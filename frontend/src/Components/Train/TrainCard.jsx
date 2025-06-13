import { Clock, IndianRupeeIcon, MapPin, Train } from "lucide-react";

const TrainCard = ({ train, onClick }) => {
  // console.log("Train Card rendered", train);

  const availableClasses = train.seatTypes?.map((st) => st.class) || [];
  const prices = train.seatTypes?.map((st) => st.fare) || [];
  const minPrice = prices.length ? Math.min(...prices) : "N/A";

  const route = train.route || [];
  const from = route.find((stop) => stop.departureTime !== null) || route[0];
  const to =
    [...route].reverse().find((stop) => stop.arrivalTime !== null) ||
    route[route.length - 1];
  const stopCount = route.length > 2 ? route.length - 2 : 0;
  return (
    <div
      onClick={() => onClick(train._id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(train._id);
        }
      }}
      className="bg-white border border-orange-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer p-5 flex flex-col md:flex-row justify-between gap-6 group hover:border-orange-400"
    >
      {/* Left Section */}
      <div className="flex flex-col justify-between flex-1 gap-4">
        {/* Train Name & Number */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-orange-500 transition">
            {train.name || "Unknown Train"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Train Number:{" "}
            <span className="font-medium text-gray-800">
              {train.trainNumber || "N/A"}
            </span>
          </p>
        </div>

        {/* Route */}
        <div className="overflow-x-auto whitespace-nowrap py-2 border-t border-b border-orange-200 flex items-center gap-6 text-gray-700 font-semibold">
          {/* From Station */}
          <div className="flex flex-col items-center text-center min-w-[80px]">
            <div className="flex items-center gap-1 text-orange-400">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">
                {from?.station?.code || from?.station?.name || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-orange-600 text-xs mt-1">
              <Clock className="w-3 h-3 translate-y-[1px]" />
              <span>Dep: {from?.departureTime ?? "N/A"}</span>
            </div>
          </div>

          {/* Train Icon + Stops */}
          <div className="flex flex-col items-center">
            <Train className="w-6 h-6 text-orange-400 mx-2" />
            {stopCount > 0 && (
              <span className="text-gray-500 italic text-xs mt-1 whitespace-nowrap">
                {stopCount} {stopCount === 1 ? "stop" : "stops"}
              </span>
            )}
          </div>

          {/* To Station */}
          <div className="flex flex-col items-center text-center min-w-[80px]">
            <div className="flex items-center gap-1 text-orange-400">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">
                {to?.station?.code || to?.station?.name || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-orange-600 text-xs mt-1 leading-none">
              <Clock className="w-3 h-3 translate-y-[1px]" />
              <span>Arr: {to?.arrivalTime ?? "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Seat Classes */}
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

        {/* Operating Days */}
        {train.operatingDays?.length > 0 ? (
          <div className="mt-4 p-3 max-w-fit overflow-x-auto whitespace-nowrap">
            <div className="flex gap-3">
              {train.operatingDays.map((day, idx) => (
                <span
                  key={idx}
                  title={day}
                  className="cursor-default select-none bg-orange-200 text-orange-900 px-4 py-1 rounded-full text-xs font-semibold shadow-sm hover:bg-orange-300 transition inline-block"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-xs italic text-gray-400 max-w-xs">
            No schedule info
          </p>
        )}
      </div>

      {/* Right Section: Price */}
      <div className="flex flex-col items-end justify-center text-right md:items-end md:justify-center">
        <p className="text-sm text-gray-500 mb-1">Min Price</p>
        <p className="text-3xl font-bold text-orange-500 flex items-center gap-1">
          <IndianRupeeIcon className="w-6 h-6" /> {minPrice}
        </p>
      </div>
    </div>
  );
};

export default TrainCard;
