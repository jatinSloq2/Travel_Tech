import { Filter, PlaneTakeoff, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FilterSidebar from "../Components/FilterSideBar";
import FlightDetailsModal from "../Components/Flight/FlightDetailsModal";
import FlightList from "../Components/Flight/FlightList";
import FlightSearchForm from "../Components/Flight/FlightSearchForm";
import OfferPart from "../Components/OfferPart"; // Import the offers carousel
import axiosInstance from "../utils/axiosInstance";

const FlightsPage = () => {
  const [airports, setAirports] = useState([]);
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [date, setDate] = useState("");
  const [seatClass, setSeatClass] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [flightResults, setFlightResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const searchFormRef = useRef(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFlightIds, setModalFlightIds] = useState([]);

  useEffect(() => {
    async function fetchAirports() {
      try {
        const response = await axiosInstance.get("/flight/airports");
        setAirports(response.data.airports);
      } catch (error) {
        console.error("❌ Error fetching airports:", error);
      }
    }
    fetchAirports();
  }, []);

  const handleSearch = async () => {
    const fromCode = fromQuery.match(/\(([^)]+)\)/)?.[1];
    const toCode = toQuery.match(/\(([^)]+)\)/)?.[1];

    if (!fromCode || !toCode || !date) {
      alert("Please fill out From, To, and Departure Date.");
      return;
    }

    try {
      setSearching(true);
      setSearched(false);

      const response = await axiosInstance.get("/flight/search", {
        params: {
          from: fromCode,
          to: toCode,
          departureDate: date,
          seatClass,
          maxPrice,
        },
      });

      setFlightResults(response.data.flights || []);
      console.log(response.data.flights)
      setSearched(true);
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
    } catch (error) {
      console.error("❌ Error searching flights:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleFlightClick = (flight) => {
    const flightIds = flight.legs
      ? flight.legs.map((leg) => leg._id || leg)
      : [flight._id || flight.flightId];

    setModalFlightIds(flightIds);
    setModalOpen(true);
  };

  const filters = [
    {
      label: "Seat Class",
      type: "select",
      value: seatClass,
      onChange: setSeatClass,
      options: [
        { value: "", label: "Any" },
        { value: "Economy", label: "Economy" },
        { value: "Business", label: "Business" },
        { value: "First", label: "First" },
      ],
    },
    {
      label: "Max Price (₹)",
      type: "number",
      value: maxPrice,
      onChange: setMaxPrice,
      placeholder: "Enter max price",
    },
  ];

  return (
    <section className="relative">
      {/* Background SVG Wave */}
      <div className="fixed top-0 left-0 w-full h-[400px] overflow-hidden z-[-1]">
        <svg
          className="w-full h-full block"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            fill="#fb923c"
            d="M0,200 C360,150 1080,50 1440,100 L1440,0 L0,0 Z"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold flex items-center gap-3 border-b-2 border-white pb-3 text-white">
          <PlaneTakeoff className="w-10 h-10" />
          Let's Fly
        </h1>

        {/* Search Form */}
        <div
          ref={searchFormRef}
          className={`z-20 rounded-md py-4 px-0 mb-12 transition-all duration-300 ${searched ? "md:sticky top-0" : ""
            }`}
        >
          <FlightSearchForm
            airports={airports}
            fromQuery={fromQuery}
            toQuery={toQuery}
            setFromQuery={setFromQuery}
            setToQuery={setToQuery}
            date={date}
            setDate={setDate}
            onSearch={handleSearch}
          />
        </div>


        <div className="grid gap-6 md:grid-cols-5 grid-cols-1">
          {flightResults.length > 0 && (
            <>
              <div className="block md:hidden sticky top-16 z-30 w-full bg-white border-b shadow-md px-4 py-3 pt">
                <button
                  onClick={() => setShowMobileFilter(true)}
                  className="flex items-center gap-2 text-orange-600 font-semibold text-base w-full justify-center"
                >
                  <Filter className="w-5 h-5 text-orange-500" />
                  Show Filters
                </button>
              </div>

              {/* Fullscreen Filter Drawer */}
              {showMobileFilter && (
                <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
                  <div className="flex items-center justify-between px-4 py-4 border-b shadow-sm sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-bold text-orange-600">
                      Filters
                    </h2>
                    <button
                      onClick={() => setShowMobileFilter(false)}
                      className="text-gray-600"
                      aria-label="Close Filters"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-4">
                    <FilterSidebar
                      filters={filters}
                      onSearch={() => {
                        handleSearch();
                        setShowMobileFilter(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Desktop Sidebar Filter */}
          {flightResults.length > 0 && (
            <aside className="hidden md:block md:col-span-1">
              <div className="sticky top-44">
                <FilterSidebar filters={filters} onSearch={handleSearch} />
              </div>
            </aside>
          )}

          {/* Flight Cards */}
          <div
            className={`${flightResults.length > 0 ? "md:col-span-4" : "md:col-span-5"
              }`}
          >
            <FlightList
              flights={flightResults}
              searching={searching}
              searched={searched}
              onFlightClick={handleFlightClick}
            />
          </div>
        </div>
      </div>
      {/* Offers Carousel - Show when no search has been made or no results */}

      <div className="mb-12">
        <OfferPart
          serviceType="flights"
        // apiEndpoint="/api/offers/flights" // Uncomment when API is ready
        />
      </div>

      {/* Alternative: Show offers even with results but make it smaller */}
      {/* You can use this instead if you want to always show offers */}
      {/* 
        <div className={`mb-12 ${searched && flightResults.length > 0 ? 'scale-90' : ''} transition-transform duration-300`}>
          <OfferPart 
            serviceType="flights"
            // apiEndpoint="/api/offers/flights"
          />
        </div>
        */}
      <FlightDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        flightIds={modalFlightIds}
        date={date}
      />
    </section>
  );
};

export default FlightsPage;