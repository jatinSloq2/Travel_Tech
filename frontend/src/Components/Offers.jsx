import React, { useState, useEffect, useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";

const categories = ["All", "Bank Offers", "Flights", "Hotels", "Cabs", "Bus", "Trains"];

const fakeOffers = [
  {
    id: 1,
    title: "Get up to 45% OFF* on Travel Bookings!",
    category: ["Bus", "Hotels", "Cabs", "Flights", "Trains"],
    validTill: "15th Jun'25",
    image: "https://img.freepik.com/free-photo/tropical-beach_74190-188.jpg",
  },
  {
    id: 2,
    title: "Up to 20% OFF* on Flights.",
    category: ["Flights"],
    validTill: "15th Jun'25",
    image: "https://img.freepik.com/free-photo/airport-terminal_53876-14492.jpg",
  },
  {
    id: 3,
    title: "Up to 45% OFF* on Hotels & Homestays",
    category: ["Hotels"],
    validTill: "15th Jun'25",
    image: "https://img.freepik.com/free-photo/modern-bedroom-interior_53876-145028.jpg",
  },
  {
    id: 4,
    title: "Bank Offers: Flat ₹1000 cashback!",
    category: ["Bank Offers"],
    validTill: "15th Jun'25",
    image: "https://img.freepik.com/free-vector/bank-building-background_23-2148152351.jpg",
  },
  {
    id: 5,
    title: "Flat 25% OFF on Bus Bookings",
    category: ["Bus"],
    validTill: "15th Jun'25",
    image: "https://img.freepik.com/free-photo/bus-public-transport_1127-3488.jpg",
  },
  {
    id: 6,
    title: "Train Sale: Save up to 30%",
    category: ["Trains"],
    validTill: "15th Jun'25",
    image: "https://img.freepik.com/free-photo/high-speed-train-station_1127-3470.jpg",
  },
  {
    id: 7,
    title: "Cab Coupons: ₹200 OFF your ride",
    category: ["Cabs"],
    validTill: "15th Jun'25",
    image: "https://img.freepik.com/free-photo/yellow-taxi-car-city-street_23-2148749984.jpg",
  },
];

const OffersCarousel = () => {
  const [offers, setOffers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const scrollRef = useRef(null);

  useEffect(() => {
    // Fake API load simulation
    setOffers(fakeOffers);
  }, []);

  const filteredOffers =
    selectedCategory === "All"
      ? offers
      : offers.filter((offer) => offer.category.includes(selectedCategory));

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-5 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Offers For You</h2>
        <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
          View All →
        </a>
      </div>

      <div className="flex space-x-2 overflow-x-auto mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded border transition ${
              selectedCategory === cat ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scroll-smooth pb-2"
        >
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="min-w-[250px] bg-white border rounded-lg shadow-sm p-3"
            >
              <img
                src={offer.image}
                alt="Offer"
                className="w-full h-32 object-cover rounded mb-2"
              />
              <div className="text-sm text-gray-600">
                {offer.category.join(", ")}
              </div>
              <div className="font-semibold text-black mb-1">{offer.title}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <FaCalendarAlt /> Valid till {offer.validTill}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border shadow-md rounded-full p-2"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default OffersCarousel;
