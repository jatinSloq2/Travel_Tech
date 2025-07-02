import { User, X } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../../utils/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";

const TrainDetailsModal = ({
  isOpen,
  trainDetails,
  loading,
  date,
  setDate,
  onClose,
}) => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  const [numTravelers, setNumTravelers] = useState(1);
  const [travelers, setTravelers] = useState([{ name: "", phone: "" }]);
  const [email, setEmail] = useState("");
  const [selectedSeatClass, setSelectedSeatClass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const formatLocalDate = (inputDate) => {
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const day = String(inputDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const selectedSeatFare =
    trainDetails?.seatTypes?.find((seat) => seat.class === selectedSeatClass)
      ?.fare || 0;

  const totalFare = selectedSeatFare * numTravelers;

const handleConfirmBooking = async () => {
  for (let i = 0; i < travelers.length; i++) {
    const t = travelers[i];
    if (!t.name.trim() || !t.phone.trim()) {
      alert(`Please fill in name and phone for traveler ${i + 1}.`);
      return;
    }
  }

  if (!selectedSeatClass) {
    alert("Please select a seat class.");
    return;
  }

  if (!email.trim()) {
    alert("Please enter contact email.");
    return;
  }

  const travelersWithSeat = travelers.map((t) => ({
    ...t,
    seatType: selectedSeatClass,
  }));

  setIsLoading(true); // Start loading

  try {
    // 1. Validate first
    const validationRes = await axiosInstance.post("/train/booking/validate/train", {
      trainId: trainDetails?.trainId,
      date: formatLocalDate(date),
      travelers: travelersWithSeat,
    });

    if (!validationRes.data.success) {
      throw new Error(validationRes.data.message || "Validation failed");
    }

    // 2. Create Stripe session
    const { data } = await axiosInstance.post(
      "/payment/create-checkout-session",
      {
        bookingType: "train",
        amount: totalFare,
        bookingDetails: {
          trainId: trainDetails?.trainId,
          date: formatLocalDate(date),
          travelers: travelersWithSeat,
        },
      }
    );

    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: data.id });

  } catch (error) {
    console.error("Booking error:", error.response?.data || error.message);
    alert(error.response?.data?.message || error.message || "Something went wrong.");
  } finally {
    setIsLoading(false); // End loading
  }
};








  // const handleConfirmBooking = async () => {
  //   for (let i = 0; i < travelers.length; i++) {
  //     const t = travelers[i];
  //     if (!t.name.trim() || !t.phone.trim()) {
  //       alert(`Please fill in name and phone for traveler ${i + 1}.`);
  //       return;
  //     }
  //   }

  //   if (!selectedSeatClass) {
  //     alert("Please select a seat class.");
  //     return;
  //   }

  //   if (!email.trim()) {
  //     alert("Please enter contact email.");
  //     return;
  //   }
  //   const travelersWithSeat = travelers.map((t) => ({
  //     ...t,
  //     seatType: selectedSeatClass,
  //   }));
  //   try {
  //     const { data } = await axiosInstance.post(
  //       "/payment/create-checkout-session",
  //       {
  //         bookingType: "train",
  //         amount: totalFare,
  //         bookingDetails: {
  //           trainId: trainDetails?.trainId,
  //           date: formatLocalDate(date),
  //           travelers: travelersWithSeat,
  //         },
  //       }
  //     );

  //     const stripe = await stripePromise;
  //     await stripe.redirectToCheckout({ sessionId: data.id });
  //   } catch (error) {
  //     console.error(
  //       "Stripe checkout error:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

  const dayMap = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const allowedDays = (trainDetails?.operatingDays || []).map(
    (day) => dayMap[day]
  );
  const isOperatingDay = (date) => allowedDays.includes(date.getDay());

  if (!isOpen) return null;

  if (!trainDetails) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading train details...
      </div>
    );
  }

  if (isLoading) {
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
          className="absolute top-1 right-1 z-50 text-gray-400 hover:text-gray-900 transition-colors duration-200"
        >
          <X size={28} />
        </button>

        {/* Train Details Section */}
        <section className="md:w-3/5 space-y-6 overflow-y-auto pr-8 border-r border-gray-300">
          <h2 className="text-3xl font-semibold text-orange-500 mb-6 select-none">
            Train Details
          </h2>

          <div className="bg-gray-50 rounded-lg border border-gray-300 p-6 shadow w-full">
            <h3 className="text-xl font-semibold text-orange-400 mb-5 select-none">
              {trainDetails.name || "N/A"} ({trainDetails.trainNumber || "N/A"})
            </h3>

            <div className="flex justify-between items-center mb-4 text-gray-700">
              <div className="flex flex-col items-start">
                <span className="text-2xl font-bold text-gray-900 select-text">
                  {trainDetails.from?.code || "N/A"}
                </span>
                <span className="text-sm text-gray-600">
                  {trainDetails.from?.name || "N/A"}
                </span>
              </div>

              <div className="text-3xl text-gray-400 select-none mx-8">→</div>

              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-gray-900 select-text">
                  {trainDetails.to?.code || "N/A"}
                </span>
                <span className="text-sm text-gray-600">
                  {trainDetails.to?.name || "N/A"}
                </span>
              </div>
            </div>

            <p className="mb-4 text-gray-700 font-medium">
              Date:{" "}
              <span className="select-text">
                {date instanceof Date
                  ? date.toLocaleDateString()
                  : trainDetails.date || "N/A"}
              </span>
            </p>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-1">
                Operating Days:
              </h4>
              <div className="flex flex-wrap gap-2">
                {trainDetails.operatingDays &&
                trainDetails.operatingDays.length > 0 ? (
                  trainDetails.operatingDays.map((day, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm select-none"
                    >
                      {day}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">Not available</span>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trainDetails.seatTypes
                ?.filter((seat) => seat.availableCount > 0)
                .map((seat, i) => {
                  const isSelected = selectedSeatClass === seat.class;

                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedSeatClass(seat.class)}
                      className={`flex justify-between items-center w-full rounded-md border p-4 text-left transition shadow-sm cursor-pointer ${
                        isSelected
                          ? "border-orange-500 bg-orange-50 shadow-md"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <span className="font-medium text-gray-800 select-text">
                        {seat.class}
                      </span>

                      <div className="flex items-center gap-4">
                        <span className="font-bold text-orange-600 select-text">
                          ₹{seat.fare}
                        </span>
                        <span className="text-xs text-gray-500 select-text">
                          {seat.availableCount}{" "}
                          {seat.availableCount === 1 ? "seat" : "seats"}{" "}
                          available
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>

        {/* Traveler Information Section */}
        <section className="w-full md:w-[40%] bg-white border border-gray-200 rounded-xl shadow-lg p-4 md:p-6 flex flex-col max-h-[90vh] overflow-hidden relative">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 select-none tracking-wide">
            Traveler Information
          </h2>

          {/* Date Picker */}
          <label className="mb-5 flex flex-col text-gray-800 px-4 font-medium select-none text-sm">
            Travel Date:
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              className="mt-2 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900 placeholder-gray-400 text-sm"
              placeholderText="Select travel date"
              filterDate={isOperatingDay}
            />
          </label>

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
          <div className="text-right text-lg font-semibold text-gray-800 mt-4 px-4">
            Total Fare: <span className="text-orange-600">₹{totalFare}</span>
          </div>

          {/* Confirm Booking button */}
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

export default TrainDetailsModal;
