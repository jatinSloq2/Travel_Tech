import React from "react";
import { CalendarDays, MapPin, IndianRupee } from "lucide-react";

const TripCard = ({
  booking,
  cancelLoading,
  onCancel,
  onReview,
  hasReviewed,
}) => {
  const {
    _id,
    type,
    hotel,
    hotelName,
    bus,
    busName,
    flights = [],
    travelers = [],
    journeyDate,
    source,
    destination,
    amount,
    checkIn,
    checkOut,
    status,
  } = booking;

  console.log(booking);

  const isHotel = type === "hotel";
  const isBus = type === "bus";
  const isFlight = type === "flight";
  const isTrain = type === "train";

  const isCancelled = status?.toLowerCase() === "cancelled";
  const isCompleted = status?.toLowerCase() === "completed";

  const title = isHotel
    ? hotelName || hotel?.name || "Hotel"
    : isBus
    ? busName || bus?.name || "Bus"
    : isFlight
    ? flights[0]?.flight?.airline || "Flight"
    : travelers[0]?.trainDetails?.name || "Train";

  const itemId = isHotel
    ? hotel?._id
    : isBus
    ? bus?._id
    : isFlight
    ? flights[0]?.flight?._id
    : travelers[0]?.train?._id || travelers[0]?.trainDetails?._id;

  const firstLeg = flights[0];
  const lastLeg = flights[flights.length - 1];

  const traveler = travelers?.[0];

  // travel date
  const travelDate = traveler?.date?.slice(0, 10); 

  const train = traveler?.train; 
  const trainNumber = train?.trainNumber || "N/A";
  const trainName = train?.name || "Train";

  // route
  const route = train?.route || [];
  const sourceName = route[0]?.station?.name || "Source";
  const destinationName =
    route[route.length - 1]?.station?.name || "Destination";

  return (
    <div className="bg-white shadow-md rounded-xl border border-gray-200 p-4 transition hover:shadow-lg">
      {/* Title and Status */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {title}
        </h2>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            isCancelled
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-700"
          }`}
        >
          {status || "Booked"}
        </span>
      </div>

      {/* Trip Summary */}
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        {isHotel && (
          <>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <span>Check-in: {checkIn?.slice(0, 10)}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <span>Check-out: {checkOut?.slice(0, 10)}</span>
            </div>
          </>
        )}

        {isBus && (
          <>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>
                {source || "From"} → {destination || "To"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <span>Journey: {journeyDate?.slice(0, 10)}</span>
            </div>
          </>
        )}

        {isFlight && (
          <>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>
                {firstLeg?.flight?.flightNumber || "From"} →{" "}
                {lastLeg?.flight?.flightNumber || "To"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <span>
                {firstLeg?.date?.slice(0, 10)} to {lastLeg?.date?.slice(0, 10)}
              </span>
            </div>
          </>
        )}

        {isTrain && (
          <>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>
                {sourceName} → {destinationName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <span>Journey: {travelDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Train:</span>
              <span>
                {trainNumber} - {trainName}
              </span>
            </div>
          </>
        )}
      </div>

      <hr className="mb-4 border-gray-300" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 font-medium text-gray-700">
          <IndianRupee className="w-4 h-4 text-gray-500" />
          <span>{amount != null ? amount.toFixed(2) : "0.00"}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {!isCancelled && !isCompleted && (
            <button
              onClick={() => onCancel(_id, type)}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-1.5 rounded"
              disabled={cancelLoading === _id}
            >
              {cancelLoading === _id ? "Cancelling..." : "Cancel"}
            </button>
          )}

          {!hasReviewed(type, itemId) && isCompleted && (
            <button
              onClick={() => onReview(_id, itemId, type)}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-1.5 rounded"
            >
              Leave Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;
