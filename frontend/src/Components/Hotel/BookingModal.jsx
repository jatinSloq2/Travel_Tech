import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaCalendarAlt,
  FaDoorOpen,
  FaTimes,
  FaUserFriends,
} from "react-icons/fa";

const BookingModal = ({
  selectedRoom,
  checkIn,
  checkOut,
  totalGuests,
  totalRooms,
  errorMessage,
  setCheckIn,
  setCheckOut,
  setTotalGuests,
  setTotalRooms,
  onClose,
  onSubmit,
}) => {
  if (!selectedRoom) return null;

  const images =
    selectedRoom.images && selectedRoom.images.length > 0
      ? selectedRoom.images
      : [];
  const [mainImage, setMainImage] = useState(images[0]);

  useEffect(() => {
    setMainImage(images[0]);
  }, [selectedRoom]);

  const [localError, setLocalError] = useState("");

  const minRooms = Math.ceil(totalGuests / 2) || 1;

  const [userChangedRooms, setUserChangedRooms] = useState(false);

  useEffect(() => {
    if (!userChangedRooms || totalRooms < minRooms) {
      setTotalRooms(minRooms);
      setUserChangedRooms(false);
    }
  }, [totalGuests, minRooms]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleRoomsChange = (e) => {
    let val = Number(e.target.value);
    if (val < minRooms) val = minRooms;

    setUserChangedRooms(true);
    setTotalRooms(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!checkIn) {
      setLocalError("Please select a check-in date.");
      return;
    }
    if (!checkOut) {
      setLocalError("Please select a check-out date.");
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setLocalError("Check-out date must be after check-in date.");
      return;
    }
    if (!totalGuests || totalGuests < 1) {
      setLocalError("Please enter a valid number of guests.");
      return;
    }
    if (!totalRooms || totalRooms < minRooms) {
      setLocalError(
        `Please enter a valid number of rooms (minimum ${minRooms}).`
      );
      return;
    }
    setLocalError("");
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white relative rounded-xl shadow-2xl max-w-5xl w-full mx-auto flex flex-col md:flex-row max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-6 md:right-4 text-gray-500 hover:text-red-600 text-xl z-50"
          aria-label="Close booking modal"
        >
          <FaTimes />
        </button>

        {/* Left Side - Room Info */}
        <div className="md:w-1/2 w-full p-4 md:p-6 bg-gray-50 flex flex-col">
          <div className="mb-4">
            <img
              src={mainImage}
              alt="Room Main"
              className="w-full h-48 md:h-64 object-cover rounded-md"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
            {images.map((imgSrc, idx) => (
              <img
                key={idx}
                src={imgSrc}
                alt={`Room ${idx + 1}`}
                onClick={() => setMainImage(imgSrc)}
                className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded cursor-pointer border-2 ${
                  imgSrc === mainImage
                    ? "border-orange-600"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            {selectedRoom.roomType}
          </h2>
          <p className="text-gray-700 mb-3 text-sm md:text-base">
            {selectedRoom.description}
          </p>

          <div className="mb-2">
            <span className="font-semibold text-gray-800">Price: </span>
            <span className="text-orange-600 font-semibold">
              ₹{selectedRoom.pricePerNight} / night
            </span>
          </div>

          <div className="mb-2 flex items-center text-gray-800 gap-2 text-sm md:text-base">
            <FaUserFriends />
            <span>Max Guests: {selectedRoom.capacity || 2} per room</span>
          </div>

          {selectedRoom.facilities && selectedRoom.facilities.length > 0 && (
            <div className="mt-2 text-sm md:text-base">
              <span className="font-semibold text-gray-800">Facilities:</span>
              <ul className="list-disc list-inside mt-1 text-gray-700">
                {selectedRoom.facilities.map((facility, idx) => (
                  <li key={idx}>{facility}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Side - Booking Form */}
        <div className="md:w-1/2 w-full p-4 md:p-6 relative flex-shrink-0 overflow-y-auto">
          <h2 className="text-lg md:text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
            <FaCalendarAlt className="text-orange-600" /> Book This Room
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Check-In
              </label>
              <DatePicker
                selected={checkIn ? new Date(checkIn) : null}
                onChange={(date) => {
                  if (!date) {
                    setCheckIn("");
                    return;
                  }
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");
                  setCheckIn(`${year}-${month}-${day}`);
                }}
                minDate={new Date()}
                placeholderText="Select check-in date"
                dateFormat="yyyy-MM-dd"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                required
                popperPlacement="auto"
                popperModifiers={[
                  {
                    name: "preventOverflow",
                    options: {
                      boundary: "viewport",
                    },
                  },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Check-Out
              </label>
              <DatePicker
                selected={checkOut ? new Date(checkOut) : null}
                onChange={(date) => {
                  if (!date) {
                    setCheckOut("");
                    return;
                  }
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");
                  setCheckOut(`${year}-${month}-${day}`);
                }}
                minDate={checkIn ? new Date(checkIn) : new Date()}
                placeholderText="Select check-out date"
                dateFormat="yyyy-MM-dd"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                required
                popperPlacement="auto"
                popperModifiers={[
                  {
                    name: "preventOverflow",
                    options: {
                      boundary: "viewport",
                    },
                  },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Guests
              </label>
              <div className="flex items-center gap-2">
                <FaUserFriends className="text-gray-500" />
                <input
                  type="number"
                  min="1"
                  value={totalGuests || ""}
                  onChange={(e) => setTotalGuests(Number(e.target.value))}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rooms
              </label>
              <div className="flex items-center gap-2">
                <FaDoorOpen className="text-gray-500" />
                <input
                  type="number"
                  min={minRooms}
                  value={totalRooms || ""}
                  onChange={handleRoomsChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Max 2 guests per room. Room count auto-adjusts based on guests.
              </p>
            </div>

            {(localError || errorMessage) && (
              <div className="bg-red-100 text-red-700 text-sm px-3 py-2 rounded border border-red-300">
                {localError || errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-400 text-white py-2 rounded hover:bg-orange-600 transition font-semibold"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
