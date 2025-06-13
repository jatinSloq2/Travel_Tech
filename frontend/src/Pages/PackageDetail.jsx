import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { format } from "date-fns";

const PackageDetail = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [traveller, setTraveller] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfTravellers: 1,
  });
  const [bookingMsg, setBookingMsg] = useState("");

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await axiosInstance.get(`/package/search/${id}`);
        setPkg(res.data.package);
      } catch (err) {
        setError("Something went wrong while fetching the package.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPackage();
  }, [id]);

const handleBooking = async () => {
  try {
    const res = await axiosInstance.post("/package/book", {
      packageId: id,
      travelers: [
        {
          fullName: traveller.name, // 👈 fix here
          email: traveller.email,
          phone: traveller.phone,
          nationality: "Indian", // optional fallback if required
        },
      ],
    });

    setBookingMsg("✅ Booking successful!");
    setTraveller({ name: "", email: "", phone: "", numberOfTravellers: 1 });
    setTimeout(() => setShowModal(false), 1500);
  } catch (err) {
    setBookingMsg("❌ Booking failed. Please try again.");
  }
};

  if (loading) return <p className="text-center mt-10">Loading package...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!pkg) return <p className="text-center mt-10">Package not found.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{pkg.name}</h1>
      <p className="text-gray-600 mb-4">{pkg.description}</p>

      {/* Images */}
      <div className="flex flex-wrap gap-4 mb-6">
        {pkg.images?.map((img, i) => (
          <img key={i} src={img} alt={`package-img-${i}`} className="w-1/3 rounded" />
        ))}
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
        <p><strong>Package Type:</strong> {pkg.packageType}</p>
        <p><strong>Travel Class:</strong> {pkg.travelClass}</p>
        <p><strong>Starting City:</strong> {pkg.startingCity}</p>
        <p><strong>Ending City:</strong> {pkg.endingCity}</p>
        <p><strong>Duration:</strong> {pkg.duration.totalDays} Days / {pkg.duration.nights} Nights</p>
        <p><strong>Cities:</strong> {pkg.duration.cities}</p>
        <p><strong>Group Size:</strong> {pkg.groupSize}</p>
        <p><strong>Cancellation Policy:</strong> {pkg.cancellationPolicy}</p>
        <p><strong>Provider:</strong> {pkg.provider?.name}</p>
        <p><strong>Rating:</strong> ⭐ {pkg.rating?.average} ({pkg.rating?.count} reviews)</p>
        <p><strong>Base Price:</strong> ₹{pkg.price?.base}</p>
        <p><strong>Created At:</strong> {format(new Date(pkg.createdAt), "dd MMM yyyy")}</p>
      </div>

      {/* Book Now Button */}
      <div className="text-center mb-10">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Book Now
        </button>
      </div>

      {/* Inclusions */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-1">Inclusions:</h3>
        <ul className="list-disc pl-5 text-green-700 text-sm">
          {pkg.inclusions?.map((inc, i) => (
            <li key={i}>{inc}</li>
          ))}
        </ul>
      </div>

      {/* Exclusions */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-1">Exclusions:</h3>
        <ul className="list-disc pl-5 text-red-700 text-sm">
          {pkg.exclusions?.map((exc, i) => (
            <li key={i}>{exc}</li>
          ))}
        </ul>
      </div>

      {/* Terms */}
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-2">Terms & Conditions:</h3>
        <p className="text-sm text-gray-600">{pkg.termsAndConditions}</p>
      </div>

      {/* Itinerary */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
        {pkg.itinerary?.map((day, index) => (
          <div key={index} className="mb-6 border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h3 className="font-bold text-lg mb-2">
              {day.city}, {day.country} ({format(new Date(day.arrivalDate), "dd MMM")} - {format(new Date(day.departureDate), "dd MMM")})
            </h3>
            <p className="text-sm text-gray-500 mb-2">Nights: {day.nights}</p>

            {/* Components */}
            {day.components?.map((comp, i) => (
              <div key={i} className="mb-4 p-3 border rounded-md bg-white">
                <p className="text-sm font-semibold capitalize mb-1 text-blue-600">
                  {comp.type} — {comp.name}
                </p>
                <p className="text-sm mb-1">{comp.description}</p>
                <p className="text-sm mb-1 text-gray-600">Location: {comp.location}</p>

                {/* Hotel Details */}
                {comp.type === "hotel" && comp.hotelDetails && comp.hotelDetails.room && (
                  <div className="mt-2 bg-gray-100 p-3 rounded">
                    <p className="font-medium">Hotel Room Details:</p>
                    <p className="text-sm">Room Type: {comp.hotelDetails.room.roomType}</p>
                    <p className="text-sm">Check-in: {format(new Date(comp.hotelDetails.checkIn), "dd MMM, HH:mm")}</p>
                    <p className="text-sm">Check-out: {format(new Date(comp.hotelDetails.checkOut), "dd MMM, HH:mm")}</p>
                    <p className="text-sm">Capacity: {comp.hotelDetails.room.capacity}</p>
                    <p className="text-sm">Amenities:</p>
                    <ul className="list-disc text-sm text-green-600 pl-5">
                      {comp.hotelDetails.room.amenities?.map((a, ai) => (
                        <li key={ai}>{a}</li>
                      ))}
                    </ul>
                    <div className="flex gap-2 mt-2">
                      {comp.hotelDetails.room.images?.map((img, k) => (
                        <img key={k} src={img} alt={`room-${k}`} className="w-20 h-16 rounded object-cover" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Book This Package</h2>

            <div className="mb-2">
              <label className="text-sm">Name</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={traveller.name}
                onChange={(e) => setTraveller({ ...traveller, name: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label className="text-sm">Email</label>
              <input
                type="email"
                className="w-full border p-2 rounded"
                value={traveller.email}
                onChange={(e) => setTraveller({ ...traveller, email: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label className="text-sm">Phone</label>
              <input
                type="tel"
                className="w-full border p-2 rounded"
                value={traveller.phone}
                onChange={(e) => setTraveller({ ...traveller, phone: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="text-sm">Number of Travellers</label>
              <input
                type="number"
                className="w-full border p-2 rounded"
                value={traveller.numberOfTravellers}
                min="1"
                onChange={(e) => setTraveller({ ...traveller, numberOfTravellers: parseInt(e.target.value) })}
              />
            </div>

            {bookingMsg && <p className="text-sm mb-3 text-center">{bookingMsg}</p>}

            <div className="flex justify-between">
              <button
                onClick={handleBooking}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetail;
