import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { User, X } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const FlightDetailsModal = ({ isOpen, onClose, flightIds, date }) => {
  const [flightDetails, setFlightDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [numTravelers, setNumTravelers] = useState(1);
  const [travelers, setTravelers] = useState([{ name: "", phone: "" }]);
  const [email, setEmail] = useState("");
  const [selectedSeats, setSelectedSeats] = useState({});
  useEffect(() => {
    if (!isOpen || !flightIds?.length || !date) return;
    const fetchFlightDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/flight/flightdetail", {
          params: { flightIds: flightIds.join(","), date },
        });
        setFlightDetails(response.data.flights);
        console.log(response);
        setSelectedSeats({});
      } catch {
        setError("Failed to load flight details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [isOpen, flightIds?.join(","), date]);
  useEffect(() => {
    setTravelers((prev) => {
      const updated = [...prev];
      while (updated.length < numTravelers)
        updated.push({ name: "", phone: "" });
      while (updated.length > numTravelers) updated.pop();
      return updated;
    });
  }, [numTravelers]);

  const handleTravelerChange = (index, field, value) => {
    const updated = [...travelers];
    updated[index][field] = value;
    setTravelers(updated);
  };

  const handleSeatSelect = (flightId, seatType) => {
    setSelectedSeats((prev) => ({ ...prev, [flightId]: seatType }));
  };

  const getTotalFare = () => {
    let total = 0;

    if (!flightDetails || !Array.isArray(flightDetails)) return total;

    for (const flight of flightDetails) {
      const flightId = flight.flightId;
      const selectedType = selectedSeats[flightId];

      const seatInfo = flight.seatTypes?.find((s) => s.type === selectedType);
      if (seatInfo) {
        total += seatInfo.price * numTravelers;
      }
    }

    return total;
  };

  const handleConfirmBooking = async () => {
    if (!flightIds.every((id) => selectedSeats[id])) {
      alert("Please select seat types for all flights.");
      return;
    }

    for (let i = 0; i < travelers.length; i++) {
      const t = travelers[i];
      if (!t.name.trim() || !t.phone.trim()) {
        alert(`Please fill in name and phone for traveler ${i + 1}.`);
        return;
      }
    }

    if (!email.trim()) {
      alert("Please enter contact email.");
      return;
    }
    const flights = flightIds.map((id) => ({
      flight: id,
      date,
      seatType: selectedSeats[id],
    }));

    const bookingDetails = { travelers, email, flights };

    setLoading(true)

    try {
      const validationRes = await axiosInstance.post(
        "/flight/booking/validate/flight",
        {
          travelers,
          email,
          flights,
        }
      );

      if (!validationRes.data.success) {
        throw new Error(validationRes.data.message || "Validation failed");
      }

      const { data } = await axiosInstance.post(
        "/payment/create-checkout-session",
        {
          bookingType: "flight",
          amount: getTotalFare(),
          bookingDetails,
        }
      );

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to start payment.";
      alert(message);
      console.error("Stripe checkout error:", error);
    } finally {
    setLoading(false);
  }
  };

  // const handleConfirmBooking = async () => {
  //   if (!flightIds.every((id) => selectedSeats[id])) {
  //     alert("Please select seat types for all flights.");
  //     return;
  //   }
  //   for (let i = 0; i < travelers.length; i++) {
  //     const t = travelers[i];
  //     if (!t.name.trim() || !t.phone.trim()) {
  //       alert(`Please fill in name and phone for traveler ${i + 1}.`);
  //       return;
  //     }
  //   }

  //   if (!email.trim()) {
  //     alert("Please enter contact email.");
  //     return;
  //   }

  //   const flights = flightIds.map((id) => ({
  //     flight: id,
  //     date,
  //     seatType: selectedSeats[id],
  //   }));

  //   const bookingPayload = {
  //     travelers,
  //     email,
  //     flights,
  //   };

  //   try {
  //     await axiosInstance.post("flight/booking", bookingPayload);
  //     alert("Booking confirmed!");
  //     onClose();
  //   } catch (error) {
  //     const message =
  //       error.response?.data?.message || "Failed to confirm booking.";
  //     alert(message);
  //     console.error(error);
  //   }
  // };

  if (!isOpen) return null;

  
  if (loading) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="text-white text-lg font-semibold animate-pulse">
        Validating seat availability...
      </div>
    </div>
  );
}

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-start p-6 overflow-auto z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row gap-8 p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 transition-colors duration-200"
        >
          <X size={28} />
        </button>

        {/* Flight Details Section */}
        <section className="md:w-3/5 space-y-6 overflow-y-auto pr-8 border-r border-gray-300">
          <h2 className="text-3xl font-semibold text-orange-500 mb-6 select-none">
            Flight Details
          </h2>

          {loading && (
            <p className="text-gray-600 text-center py-8 select-none">
              Loading flight details...
            </p>
          )}

          {error && (
            <p className="text-red-600 text-center py-8 select-none">{error}</p>
          )}

          {!loading &&
          !error &&
          Array.isArray(flightDetails) &&
          flightDetails.length > 0 ? (
            <div className="flex flex-col space-y-10 relative">
              {flightDetails.map((flight, index) => (
                <div
                  key={flight.flightId || index}
                  className="relative flex items-start"
                >
                  {/* Connector line for multi-leg flights */}
                  {index < flightDetails.length - 1 && (
                    <div className="absolute top-full left-10 h-16 border-l-4 border-orange-600 rounded"></div>
                  )}

                  <div className="bg-gray-50 rounded-lg border border-gray-300 p-6 shadow hover:shadow-lg transition-shadow w-full ml-12">
                    <h3 className="text-xl font-semibold text-orange-400 mb-5 select-none">
                      {flightDetails.length === 1
                        ? "Direct Flight"
                        : index === 0
                        ? `Leg ${index + 1}: Departure`
                        : `Leg ${index + 1}: Connecting Flight`}
                    </h3>

                    <div className="flex justify-between items-center mb-4 text-gray-700">
                      <span className="font-medium">Airline:</span>
                      <span className="font-semibold text-orange-700">
                        {flight.airline || "N/A"} (
                        {flight.flightNumber || "N/A"})
                      </span>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      {/* FROM */}
                      <div className="flex flex-col items-start">
                        <span className="text-2xl font-bold text-gray-900 select-text">
                          {flight.from?.code || "N/A"}
                        </span>
                        <span className="text-sm text-gray-600">
                          {flight.from?.city || "N/A"}
                        </span>
                        <span className="text-sm mt-1 font-medium text-gray-700 select-text">
                          Departure: {flight.departureTime || "N/A"}
                        </span>
                      </div>

                      {/* Arrow */}
                      <div className="text-3xl text-gray-400 select-none mx-8">
                        →
                      </div>

                      {/* TO */}
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-bold text-gray-900 select-text">
                          {flight.to?.code || "N/A"}
                        </span>
                        <span className="text-sm text-gray-600">
                          {flight.to?.city || "N/A"}
                        </span>
                        <span className="text-sm mt-1 font-medium text-gray-700 select-text">
                          Arrival: {flight.arrivalTime || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Seat types selection */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {flight.seatTypes
                        ?.filter((seatType) => seatType.availableCount > 0)
                        .map((seatType, i) => {
                          const isSelected =
                            selectedSeats[flight.flightId] === seatType.type;
                          return (
                            <button
                              key={i}
                              onClick={() =>
                                handleSeatSelect(flight.flightId, seatType.type)
                              }
                              className={`flex justify-between items-center w-full rounded-md border p-4 text-left transition shadow-sm ${
                                isSelected
                                  ? "border-orange-500 bg-orange-50 shadow-md"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              <span className="font-medium text-gray-800 select-text">
                                {seatType.type}
                              </span>
                              <span className="font-bold text-orange-600 select-text">
                                ₹{seatType.price}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <p className="text-center text-gray-600 select-none">
                No flight details available.
              </p>
            )
          )}
        </section>

        {/* Traveler Information Section */}
        <section className="w-full md:w-[40%] bg-white border border-gray-200 rounded-xl shadow-lg p-4 md:p-6 flex flex-col max-h-[90vh] overflow-hidden relative">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 select-none tracking-wide">
            Traveler Information
          </h2>

          {/* Number of Travelers */}
          <label className="mb-5 text-gray-800 font-medium select-none">
            Number of Travelers:
            <div className="mt-2 inline-flex items-center border ms-4 border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-orange-400 max-w-[220px]">
              <div className="px-2 text-orange-500 flex items-center">
                <User size={18} />
              </div>
              <input
                type="number"
                min={1}
                value={numTravelers}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 1) setNumTravelers(val);
                }}
                className="w-[50px] py-1.5 text-center text-gray-900 outline-none appearance-none font-semibold text-sm"
              />
              <div className="flex flex-col border-l border-gray-300 select-none">
                <button
                  type="button"
                  onClick={() => setNumTravelers(numTravelers + 1)}
                  className="px-2 py-1 text-orange-600 font-bold hover:bg-orange-100 transition text-sm"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() =>
                    numTravelers > 1 && setNumTravelers(numTravelers - 1)
                  }
                  className={`px-2 py-1 text-orange-600 font-bold hover:bg-orange-100 transition text-sm ${
                    numTravelers <= 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={numTravelers <= 1}
                >
                  −
                </button>
              </div>
            </div>
          </label>

          {/* Traveler inputs */}
          <div className="flex-grow overflow-y-auto space-y-4 mb-4 px-2 mx-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-gray-100">
            {travelers.map((traveler, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold text-gray-800 text-sm">
                  Traveler {index + 1}
                </h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={traveler.name}
                  onChange={(e) =>
                    handleTravelerChange(index, "name", e.target.value)
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900 placeholder-gray-400 text-sm"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={traveler.phone}
                  onChange={(e) =>
                    handleTravelerChange(index, "phone", e.target.value)
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900 placeholder-gray-400 text-sm"
                />
              </div>
            ))}
          </div>

          {/* Email input */}
          <label className="mb-5 flex flex-col text-gray-800 px-4 font-medium select-none text-sm">
            Contact Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="mt-2 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900 placeholder-gray-400 text-sm"
            />
          </label>
          <div className="text-right mt-2 text-sm text-gray-800 font-medium">
            Total Fare: ₹{getTotalFare()}
          </div>
          <button
            onClick={handleConfirmBooking}
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-3 rounded-md shadow-sm transition duration-200 text-sm"
          >
            Confirm Booking
          </button>
        </section>
      </div>
    </div>
  );
};

export default FlightDetailsModal;
