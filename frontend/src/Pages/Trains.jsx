import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { FaTrain } from "react-icons/fa";
import { Filter } from "lucide-react";

import TrainSearchForm from "../Components/Train/TrainSearchForm";
import TrainList from "../Components/Train/TrainList";
import TrainDetailsModal from "../Components/Train/TrainDetailsModal";
import FilterSidebar from "../Components/FilterSideBar";
import OffersCarousel from "../Components/OfferPart";

const TrainsPage = () => {
  const [stations, setStations] = useState([]);
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [date, setDate] = useState("");
  const [seatClass, setSeatClass] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [trainResults, setTrainResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedTrainId, setSelectedTrainId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrainDetails, setSelectedTrainDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const searchFormRef = useRef(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axiosInstance.get("/train/stations");
        setStations(response.data.stations);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };
    fetchStations();
  }, []);

  const formatLocalDate = (inputDate) => {
    const tzOffset = inputDate.getTimezoneOffset() * 60000;
    return new Date(inputDate - tzOffset).toISOString().split("T")[0];
  };

  const handleSearch = async () => {
    if (!fromQuery || !toQuery || !date) {
      alert("Please fill out From, To, and Departure Date.");
      return;
    }

    try {
      setSearching(true);
      setSearched(false);
      const formattedDate = formatLocalDate(date);

      const response = await axiosInstance.get("/train", {
        params: {
          stations: `${fromQuery},${toQuery}`,
          departureDate: formattedDate,
        },
      });

      setTrainResults(response.data.trains || []);
      setSearched(true);

      setTimeout(() => {
        if (searchFormRef.current) {
          const headerOffset = 8;
          const elementPosition =
            searchFormRef.current.getBoundingClientRect().top;
          const offsetPosition =
            window.pageYOffset + elementPosition - headerOffset;
          window.requestAnimationFrame(() => {
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          });
        }
      }, 100);
    } catch (error) {
      console.error("Error searching trains:", error);
    } finally {
      setSearching(false);
    }
  };

  const openTrainDetails = async (trainId) => {
    if (!date) return alert("Please select a date first.");
    setSelectedTrainId(trainId);
    setModalOpen(true);
    setLoadingDetails(true);

    try {
      const response = await axiosInstance.get("/train/traindetail", {
        params: { trainId, date: formatLocalDate(date) },
      });
      setSelectedTrainDetails(response.data.train);
    } catch (err) {
      alert("Error fetching train details");
      setModalOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (modalOpen && selectedTrainId && date) {
      openTrainDetails(selectedTrainId);
    }
  }, [date]);

  const filters = [
    {
      label: "Seat Type",
      type: "select",
      value: seatClass,
      onChange: setSeatClass,
      options: [
        { value: "", label: "Any" },
        { value: "Sleeper", label: "Sleeper" },
        { value: "AC 3-Tier", label: "AC 3-Tier" },
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
      {/* Background Wave */}
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

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-10 flex items-center gap-3 border-b-2 border-white pb-3 text-white">
          <FaTrain className="w-10 h-10" />
          Search Trains
        </h1>

        {/* Search Form */}
        <div
          ref={searchFormRef}
          className={`z-20 rounded-md py-4 px-0 mb-12 transition-all duration-300 ${
            searched ? "md:sticky top-0" : ""
          }`}
        >
          <TrainSearchForm
            stations={stations}
            fromQuery={fromQuery}
            toQuery={toQuery}
            setFromQuery={setFromQuery}
            setToQuery={setToQuery}
            date={date}
            setDate={setDate}
            onSearch={handleSearch}
          />
        </div>

        {/* Filters + Train Results Grid */}
        {trainResults.length > 0 && (
          <>
            {/* Mobile Filter Toggle */}
            <div className="block md:hidden sticky top-16 z-30 w-full bg-white border-b shadow-md px-4 py-3">
              <button
                onClick={() => setShowMobileFilter(true)}
                className="flex items-center gap-2 text-orange-600 font-semibold text-base w-full justify-center"
              >
                <Filter className="w-5 h-5 text-orange-500" />
                Show Filters
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-5 grid-cols-1">
              {/* Desktop Sidebar Filter */}
              <aside className="hidden md:block md:col-span-1">
                <div className="sticky top-44">
                  <FilterSidebar filters={filters} onSearch={handleSearch} />
                </div>
              </aside>

              {/* Train Cards */}
              <div className="md:col-span-4">
                <TrainList
                  trains={trainResults}
                  searching={searching}
                  searched={searched}
                  onTrainClick={(train) => openTrainDetails(train._id)}
                />
              </div>
            </div>
          </>
        )}
      </div>
       <div className="mb-12">
                <OffersCarousel
                  serviceType="trains"
                // apiEndpoint="/api/offers/flights" // Uncomment when API is ready
                />
              </div>

      {/* Train Details Modal */}
      {modalOpen && (
        <TrainDetailsModal
          isOpen={modalOpen}
          trainDetails={selectedTrainDetails}
          loading={loadingDetails}
          date={date}
          setDate={setDate}
          onClose={() => {
            setModalOpen(false);
            setSelectedTrainDetails(null);
          }}
        />
      )}

      {/* ✅ Mobile Filter Sidebar Rendering */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 bg-white shadow-lg overflow-y-auto px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-orange-600">Filters</h2>
            <button
              onClick={() => setShowMobileFilter(false)}
              className="text-gray-500 hover:text-red-600 text-sm"
            >
              Close ✕
            </button>
          </div>
          <FilterSidebar filters={filters} onSearch={handleSearch} />
        </div>
      )}
    </section>
  );
};

export default TrainsPage;
