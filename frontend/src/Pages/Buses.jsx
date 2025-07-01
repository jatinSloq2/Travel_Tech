import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { BusFront } from "lucide-react";
import FilterSidebar from "../Components/FilterSideBar";
import { Filter } from "lucide-react";
import BusSearchForm from "../Components/Bus/BusSearchForm";
import BusList from "../Components/Bus/BusList";
import SeatBookingModal from "../Components/Bus/SeatBookingModal";
import { addDays, format } from "date-fns";
import { FaBus } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";

const Buses = () => {
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    date: tomorrow,
    busType: "",
    maxPrice: "",
  });
  const [cities, setCities] = useState([]);
  const [buses, setBuses] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [seatSelections, setSeatSelections] = useState([]);
  const [travelers, setTravelers] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const searchFormRef = useRef(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data } = await axiosInstance.get("/bus/cities");
        if (data?.success && Array.isArray(data.cities)) {
          setCities(data.cities);
        }
      } catch (error) {
        console.error("Failed to fetch cities", error);
      }
    };
    fetchCities();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchBuses = async () => {
    setSearching(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v)
      );
      const { data } = await axiosInstance.get("/bus/buses", { params });
      console.log(data)
      setBuses(Array.isArray(data?.buses) ? data.buses : []);
      setTimeout(() => {
        if (searchFormRef.current) {
          const headerOffset = 8;
          const elementPosition =
            searchFormRef.current.getBoundingClientRect().top;
          const offsetPosition =
            window.pageYOffset + elementPosition - headerOffset;

          window.requestAnimationFrame(() => {
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          });
        }
      }, 100);
    } catch (err) {
      console.error("Error fetching buses:", err);
      setBuses([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!filters.origin.trim()) {
      alert("Please select an origin city before searching.");
      return;
    }
    if (!filters.date.trim()) {
      alert("Please select a journey date before searching.");
      return;
    }
    setSearched(true);
    fetchBuses();
  };

  const openModal = (bus) => {
    setSelectedBus(bus);
    setSeatSelections([]);
    setTravelers([]);
  };
  const closeModal = () => setSelectedBus(null);

  const toggleSeat = (seat) => {
    const isSel = seatSelections.includes(seat);
    setSeatSelections((prev) =>
      isSel ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
    setTravelers((prev) =>
      isSel
        ? prev.filter((t) => t.seatNumber !== seat)
        : [...prev, { name: "", age: "", seatNumber: seat }]
    );
  };

  const changeTraveler = (idx, field, val) => {
    setTravelers((prev) => {
      const updated = [...prev];
      updated[idx][field] = val;
      return updated;
    });
  };

  const calcTotal = () => {
    if (!selectedBus) return 0;
    const { seatTypes = {}, prices = {} } = selectedBus;
    return seatSelections.reduce((sum, seat) => {
      const seatType = Object.keys(seatTypes).find((t) =>
        seatTypes[t]?.includes(seat)
      );
      return sum + (prices[seatType] || 0);
    }, 0);
  };

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const handleStripeCheckout = async () => {
    try {
      const { data } = await axiosInstance.post("/payment/create-checkout-session",
        {
          bookingType: 'bus',
          amount: calcTotal(),
          bookingDetails: {
            busId: selectedBus._id,
            date: filters.date,
            selectedSeats: seatSelections,
            travelers,
          },
        }
      );

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.error(
        "Stripe checkout error:",
        error.response?.data || error.message
      );
    }
  };
  const handleJourneyDateChange = (newDate) => {
    const formatted = newDate.toLocaleDateString("en-CA");
    setFilters((prev) => ({ ...prev, date: formatted }));
  };

  const filter = [
    {
      label: "Bus Type",
      type: "select",
      name: "busType",
      value: filters.busType,
      onChange: (value) => setFilters((prev) => ({ ...prev, busType: value })),
      options: [
        { value: "", label: "All Types" },
        { value: "AC", label: "AC" },
        { value: "Non-AC", label: "Non-AC" },
        { value: "Sleeper", label: "Sleeper" },
        { value: "Seater", label: "Seater" },
      ],
    },
    {
      label: "Max Price (₹)",
      type: "number",
      name: "maxPrice",
      value: filters.maxPrice,
      onChange: (value) => setFilters((prev) => ({ ...prev, maxPrice: value })),
      placeholder: "Enter max price",
    },
  ];

  return (
    <section className="relative">
      <div className="absolute top-0 left-0 w-full h-[400px] overflow-hidden pointer-events-none z-0">
        <svg
          className="w-full h-full block"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#fb923c"
            d="M0,160L80,170.7C160,181,320,203,480,197.3C640,192,800,160,960,160C1120,160,1280,192,1360,208L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-10 flex items-center gap-3 border-b-2 border-white pb-3 text-white">
          <FaBus className="w-10 h-10" />
          Search Buses
        </h1>
        <div
          ref={searchFormRef}
          className={`z-20 rounded-md p-4 mb-12 transition-all duration-300 ${
            searched ? "md:sticky top-0" : ""
          }`}
        >
          <BusSearchForm
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearchSubmit}
            searching={searching}
            cities={cities}
          />
        </div>

        {searched && buses.length > 0 && (
          <div className="block md:hidden sticky top-16 z-30 w-full bg-white border-b shadow-md px-4 py-3">
            <button
              onClick={() => setShowMobileFilter(true)}
              className="flex items-center gap-2 text-orange-600 font-semibold text-base w-full justify-center"
            >
              <Filter className="w-5 h-5 text-orange-500" />
              Show Filters
            </button>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-5 grid-cols-1">
          {/* Desktop Sidebar Filter */}
          {searched && buses.length > 0 && (
            <aside className="hidden md:block md:col-span-1">
              <div className="sticky top-44">
                <FilterSidebar filters={filter} onSearch={handleSearchSubmit} />
              </div>
            </aside>
          )}
          {/* Bus List */}
          <div className="md:col-span-4">
            <BusList
              buses={buses}
              searching={searching}
              onSelect={openModal}
              searched={searched}
            />
          </div>
        </div>

        {/* Booking Modal */}
        {selectedBus && (
          <SeatBookingModal
            bus={selectedBus}
            journeyDate={filters.date}
            onJourneyDateChange={(newDate) =>
              setFilters((prev) => ({ ...prev, date: newDate }))
            }
            seatSelections={seatSelections}
            travelers={travelers}
            onSeatToggle={toggleSeat}
            onTravelerChange={changeTraveler}
            onDateChange={handleJourneyDateChange}
            allowDateChange={true}
            onClose={closeModal}
            onConfirm={handleStripeCheckout}
            totalAmount={calcTotal()}
            bookingLoading={bookingLoading}
          />
        )}
      </div>

      {searched && buses.length > 0 && showMobileFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-3/4 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="text-red-500 font-bold text-sm"
              >
                Close
              </button>
            </div>
            <FilterSidebar
              filters={filter}
              onSearch={() => {
                setShowMobileFilter(false);
                handleSearchSubmit(new Event("submit"));
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Buses;
