import { useContext, useRef, useState } from "react";
import { HotelContext } from "../Context/HotelContext";
import { useNavigate } from "react-router-dom";
import { BedDouble, Filter, X } from "lucide-react";
import { FaHotel } from "react-icons/fa";

import HotelFilter from "../Components/Hotel/HotelFilter";
import HotelList from "../Components/Hotel/HotelList";
import Pagination from "../Components/Pagination";
import FilterSidebar from "../Components/FilterSideBar";
import OffersCarousel from "../Components/OfferPart";

const HotelPage = () => {
  const { state, dispatch, fetchHotels } = useContext(HotelContext);
  const {
    hotels,
    loading,
    error,
    page,
    total,
    limit,
  } = state;

  const navigate = useNavigate();
  const searchFormRef = useRef(null);

  const [form, setForm] = useState({
    city: "",
    maxPrice: "",
    checkIn: null,
    checkOut: null,
    totalGuests: "",
    totalRooms: "",
  });

  const [hasSearched, setHasSearched] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const handleSearch = () => {
    if (!form.city.trim()) {
      alert("Please enter a city.");
      return;
    }

    dispatch({ type: "SET_FILTER", payload: form });
    setHasSearched(true);
    fetchHotels();

    // Smooth scroll to search form
    setTimeout(() => {
      const el = searchFormRef.current;
      if (el) {
        const offsetTop = el.getBoundingClientRect().top + window.scrollY - 8;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    }, 100);
  };

  const clearFilters = () => {
    setForm({
      city: "",
      maxPrice: "",
      checkIn: null,
      checkOut: null,
      totalGuests: "",
      totalRooms: "",
    });

    dispatch({
      type: "SET_FILTER",
      payload: {
        city: "",
        maxPrice: "",
        checkIn: "",
        checkOut: "",
        totalGuests: "",
        totalRooms: "",
      },
    });

    setHasSearched(false);
  };

  return (
    <section className="relative">
      <div className="absolute top-0 left-0 w-full h-[400px] overflow-hidden pointer-events-none z-0">
        <svg className="w-full h-full block" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path fill="#fb923c" d="M0,200 C360,150 1080,50 1440,100 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-10 flex items-center gap-3 border-b-2 border-white pb-3 text-white">
          <FaHotel className="w-10 h-10" />
          Search Hotels
        </h1>

        <div
          ref={searchFormRef}
          className={`z-20 rounded-md p-4 mb-12 transition-all duration-300 ${hasSearched ? "md:sticky top-0" : ""
            }`}
        >
          <HotelFilter
            searchCity={form.city}
            searchPrice={form.maxPrice}
            searchCheckIn={form.checkIn}
            searchCheckOut={form.checkOut}
            searchGuests={form.totalGuests}
            searchRooms={form.totalRooms}
            onCityChange={(val) => setForm((f) => ({ ...f, city: val }))}
            onPriceChange={(e) =>
              setForm((f) => ({ ...f, maxPrice: e.target.value }))
            }
            onCheckInChange={(val) => setForm((f) => ({ ...f, checkIn: val }))}
            onCheckOutChange={(val) =>
              setForm((f) => ({ ...f, checkOut: val }))
            }
            onGuestsChange={(e) =>
              setForm((f) => ({ ...f, totalGuests: e.target.value }))
            }
            onRoomsChange={(e) =>
              setForm((f) => ({ ...f, totalRooms: e.target.value }))
            }
            onSearch={handleSearch}
            onClear={clearFilters}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-5 grid-cols-1">
          {hotels.length > 0 && (
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

          {showMobileFilter && (
            <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-4 border-b shadow-sm sticky top-0 bg-white z-10">
                <h2 className="text-lg font-bold text-orange-600">Filters</h2>
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
                  filters={[
                    {
                      label: "Max Price (₹)",
                      type: "number",
                      value: form.maxPrice,
                      onChange: (val) =>
                        setForm((f) => ({ ...f, maxPrice: val })),
                      placeholder: "Enter max price",
                    },
                  ]}
                  onSearch={() => {
                    handleSearch();
                    setShowMobileFilter(false);
                  }}
                />
              </div>
            </div>
          )}

          {hotels.length > 0 && (
            <aside className="hidden md:block md:col-span-1">
              <div className="sticky top-44">
                <FilterSidebar
                  filters={[
                    {
                      label: "Max Price (₹)",
                      type: "number",
                      value: form.maxPrice,
                      onChange: (val) =>
                        setForm((f) => ({ ...f, maxPrice: val })),
                      placeholder: "Enter max price",
                    },
                  ]}
                  onSearch={handleSearch}
                />
              </div>
            </aside>
          )}

          <div className={`${hotels.length > 0 ? "md:col-span-4" : "md:col-span-5"}`}>
            <HotelList
              hotels={hotels}
              onHotelClick={(id) => navigate(`/hotels/${id}`)}
            />
          </div>
        </div>
        <div>
          {!hasSearched ? (
            <>
              <p className="text-center text-gray-600 mt-8">
                Please enter search criteria and click Search to see hotels.
              </p>
              <div className="mb-12">
                <OffersCarousel
                  serviceType="hotels"
                // apiEndpoint="/api/offers/flights" // Uncomment when API is ready
                />
              </div>
            </>
          ) : loading ? (
            <>
              <p className="text-center text-gray-600 mt-8">Loading hotels...</p>
              <div className="mb-12">
                <OffersCarousel
                  serviceType="hotels"
                // apiEndpoint="/api/offers/flights" // Uncomment when API is ready
                />
              </div>
            </>
          ) : error ? (
            <section
              role="region"
              aria-live="polite"
              className="w-full py-24 px-6 bg-orange-50 text-center text-gray-700"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col items-center space-y-6">
                  <h2 className="text-2xl font-bold">No hotels found</h2>
                  <p className="text-base text-gray-500">
                    We couldn’t find any matching results. Try adjusting your
                    filters or search criteria.
                  </p>
                </div>
              </div>
              <div className="mb-12">
                <OffersCarousel
                  serviceType="hotels"
                // apiEndpoint="/api/offers/flights" // Uncomment when API is ready
                />
              </div>
            </section>
          ) : ((
              <>
                <div className="mb-12">
                  <OffersCarousel
                    serviceType="hotel"
                  // apiEndpoint="/api/offers/flights" // Uncomment when API is ready
                  />
                </div>

                <Pagination
                  total={total}
                  limit={limit}
                  currentPage={page}
                  onPageChange={(p) => dispatch({ type: "SET_PAGE", payload: p })}
                />
              </>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default HotelPage;
