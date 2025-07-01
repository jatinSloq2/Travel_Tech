import React, { useState } from "react";
import { MapPin, X, IndianRupee } from "lucide-react"; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SeatBookingModal = ({
  bus,
  journeyDate,
  seatSelections,
  onJourneyDateChange,
  travelers,
  onSeatToggle,
  onTravelerChange,
  onClose,
  onConfirm,
  totalAmount,
  bookingLoading,
}) => {
  const [activeTab, setActiveTab] = useState("seats");
  const rows = [];
  for (let i = 0; i < bus.allSeats.length; i += 4) {
    rows.push(bus.allSeats.slice(i, i + 4));
  }
  const seatTypeInfo = Object.entries(bus.prices ?? {}).map(([type, price]) => {
    const seatsOfType = bus.seatTypes?.[type] ?? [];
    const availableCount = seatsOfType.filter((s) =>
      bus.availableSeats.includes(s)
    ).length;
    return {
      type,
      price,
      availableCount,
      totalCount: seatsOfType.length,
    };
  });

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-800 transition"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-orange-500 mb-5 flex items-center gap-2">
          🚌 <span className="truncate">{bus.name} – Select Your Seats</span>
        </h2>

        {/* Trip Meta */}
        <div className="mb-6 text-sm text-gray-700 space-y-1 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <strong>Journey Date:</strong>
            <DatePicker
              selected={journeyDate ? new Date(journeyDate) : null}
              onChange={(date) =>
                onJourneyDateChange(date.toISOString().split("T")[0])
              }
              filterDate={(date) =>
                (bus.runningDays || []).includes(
                  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                    date.getDay()
                  ]
                )
              }
              minDate={new Date()}
              placeholderText="Select Journey Date"
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>
          <p>
            <strong>Operator:</strong> {bus.operator}
          </p>
          <p>
            <strong>Departure from {bus.route.origin}</strong>{" "}
            {bus.route.stops[0].arrivalTime} |{" "}
            <strong>Arrival at {bus.route.destination}</strong>{" "}
            {bus.route.stops.length
              ? bus.route.stops[bus.route.stops.length - 1].arrivalTime
              : "N/A"}
          </p>
        </div>

        {/* Price List */}
        <section className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-1">Price List</h3>
          <p className="text-sm text-gray-500 mb-3">
            <span className="font-medium text-gray-700">Bus Type:</span>{" "}
            {bus.busType || "Not specified"}
          </p>

          {seatTypeInfo.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {seatTypeInfo
                .filter(({ totalCount }) => totalCount > 0)
                .map(({ type, price, availableCount, totalCount }) => (
                  <div
                    key={type}
                    className="p-4 border rounded-lg bg-gray-50 shadow-sm text-center"
                  >
                    <p className="font-semibold text-gray-900">{type}</p>
                    <p className="flex items-center justify-center gap-1 text-orange-600 font-bold mt-1">
                      <IndianRupee className="w-4 h-4" />
                      {price}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {availableCount}/{totalCount}&nbsp;available
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="italic text-gray-400">Price details not available</p>
          )}
        </section>

        {/* Tabs Navigation */}
        <nav className="flex gap-4 border-b border-gray-300 mb-6">
          {[
            { id: "seats", label: "Seat Details" },
            { id: "stops", label: "Stops" },
            { id: "amenities", label: "Amenities" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`py-2 px-4 font-semibold transition ${
                activeTab === id
                  ? "border-b-4 border-orange-500 text-orange-600"
                  : "text-gray-600 hover:text-orange-500"
              }`}
              type="button"
              aria-selected={activeTab === id}
              role="tab"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Tabs Content */}
        <div role="tabpanel">
          {activeTab === "seats" && (
            <>
              {/* Seat Layout */}
              <section>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Select Seats
                </h3>
                <div className="bg-gray-50 p-5 rounded-lg border border-orange-200 shadow-inner">
                  {rows.map((row, idx) => (
                    <div
                      key={idx}
                      className="flex justify-center gap-6 mb-3 last:mb-0"
                    >
                      {row.map((seat) => {
                        const available = bus.availableSeats.includes(seat);
                        const selected = seatSelections.includes(seat);
                        const baseClass =
                          "w-12 h-12 text-sm font-semibold rounded flex items-center justify-center border select-none transition";

                        let seatClass = "";
                        if (!available) {
                          seatClass =
                            "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300";
                        } else if (selected) {
                          seatClass =
                            "bg-orange-500 text-white border-orange-600 shadow-lg";
                        } else {
                          seatClass =
                            "bg-white text-gray-700 border-gray-300 hover:bg-orange-100 cursor-pointer";
                        }

                        return (
                          <button
                            key={seat}
                            disabled={!available}
                            onClick={() => onSeatToggle(seat)}
                            className={`${baseClass} ${seatClass}`}
                            aria-pressed={selected}
                            aria-label={`Seat ${seat} ${
                              available ? "available" : "unavailable"
                            }`}
                            type="button"
                          >
                            {seat}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Traveller Inputs */}
                <section className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Traveller Details
                  </h3>
                  <div className="space-y-3">
                    {travelers.map((trav, idx) => (
                      <div
                        key={idx}
                        className="flex flex-wrap items-center gap-3 text-gray-800"
                      >
                        <label className="font-semibold w-20 shrink-0">
                          Seat {trav.seatNumber}:
                        </label>
                        <input
                          type="text"
                          value={trav.name}
                          onChange={(e) =>
                            onTravelerChange(idx, "name", e.target.value)
                          }
                          placeholder="Name"
                          className="border rounded px-3 py-2 flex-grow min-w-[150px] focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <input
                          type="number"
                          min={0}
                          value={trav.age}
                          onChange={(e) =>
                            onTravelerChange(idx, "age", e.target.value)
                          }
                          placeholder="Age"
                          className="border rounded px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </section>
            </>
          )}

          {activeTab === "stops" && (
            <section>
              <h3 className="font-semibold text-gray-800 mb-3">
                Stand Details
              </h3>
              {bus.route?.stops && bus.route.stops.length > 0 ? (
                <div className="space-y-3 text-gray-700 text-sm border border-orange-200 rounded p-4 bg-orange-50">
                  {bus.route.stops.map((stop, idx) => (
                    <div
                      key={stop._id || idx}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"
                    >
                      <div>
                        <span className="font-semibold">
                          {stop.city || stop.name}
                        </span>{" "}
                        <span className="italic text-gray-500">
                          ({stop.stand || "No stand info"})
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 sm:text-right">
                        <div>Arrival: {stop.arrivalTime || "N/A"}</div>
                        <div>Departure: {stop.departureTime || "N/A"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="italic text-gray-400">
                  Stand details not available
                </p>
              )}
            </section>
          )}

          {activeTab === "amenities" && (
            <section>
              <h3 className="font-semibold text-gray-800 mb-3">Amenities</h3>
              {bus.amenities && bus.amenities.length > 0 ? (
                <ul className="flex flex-wrap gap-3 text-xs text-white">
                  {bus.amenities.map((amenity, idx) => (
                    <li
                      key={idx}
                      className="bg-orange-500 rounded-full px-3 py-1 font-semibold"
                    >
                      {amenity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-gray-400">No amenities listed</p>
              )}
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <p className="text-lg font-semibold text-gray-700 flex items-center gap-1">
            <IndianRupee className="w-5 h-5" /> {totalAmount}
          </p>
          <button
            onClick={onConfirm}
            disabled={bookingLoading}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded font-semibold transition"
            type="button"
          >
            {bookingLoading ? "Booking…" : "Confirm Booking"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SeatBookingModal;