import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import BookingModal from "../Components/Hotel/BookingModal";
import { fetchHotelById } from "../Services/DashboardServices";
import axiosInstance from "../utils/axiosInstance";

import HotelOverview from "../Components/Hotel/HotelOverview";
import HotelRatingAmenities from "../Components/Hotel/HotelRatingAmenities";

import SectionNav from "../Components/Hotel/SectionNav";
import RoomsSection from "../Components/Hotel/RoomSection";
import AmenitiesSection from "../Components/Hotel/AmenitiesSection";
import GallerySection from "../Components/Hotel/GallerySection";
import GalleryModal from "../Components/Hotel/GallerySection";
import ReviewsSection from "../Components/Hotel/ReviewSection";
import LocationSection from "../Components/Hotel/LocationSection";
import SuccessMessage from "../Components/Hotel/SuccessMessage";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const sections = [
  { key: "rooms", label: "Rooms" },
  { key: "amenities", label: "Amenities" },
  { key: "gallery", label: "Gallery" },
  { key: "reviews", label: "Reviews" },
  { key: "location", label: "Location" },
];

const HotelPage = () => {
  const { id } = useParams();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalGuests, setTotalGuests] = useState(1);
  const [totalRooms, setTotalRooms] = useState(1);
  const [name, setName] = useState("");
  const [activeSection, setActiveSection] = useState("rooms");

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const data = await fetchHotelById(id);
        setHotel(data.hotel);
        setRooms(data.rooms || []);
        setReviews(data.reviews || []);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load hotel.");
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  useEffect(() => {
    const capacity = selectedRoom?.capacity || 2;
    const neededRooms = Math.ceil(totalGuests / capacity);
    if (neededRooms > totalRooms) setTotalRooms(neededRooms);
  }, [totalGuests, selectedRoom]);

  const openBookingModal = useCallback((room) => {
    setSelectedRoom(room);
    setErrorMessage("");
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedRoom(null);
    setErrorMessage("");
    setCheckIn("");
    setCheckOut("");
    setTotalGuests(1);
    setTotalRooms(1);
    setName("");
  }, []);

 
  const openGalleryModal = (index) => {
    setCurrentImageIndex(index);
    setGalleryModalOpen(true);
  };

  const closeGalleryModal = () => {
    setGalleryModalOpen(false);
  };

  const showPrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? hotel.images.length - 1 : prev - 1
    );
  };

  const showNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === hotel.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleBookingSubmit = async () => {
    if (!checkIn || !checkOut || !selectedRoom) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setErrorMessage("Check-out must be after check-in.");
      return;
    }

    const nights =
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
      (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      setErrorMessage("Check-out must be at least 1 day after check-in.");
      return;
    }

    const totalAmount = selectedRoom.pricePerNight * totalRooms * nights;

    const bookingDetails = {
      hotelId: hotel._id,
      roomId: selectedRoom._id,
      checkIn,
      checkOut,
      totalGuests,
      totalRooms,
    };

    try {
      const { data } = await axiosInstance.post(
        "/payment/create-checkout-session",
        {
          bookingType: "hotel",
          amount: totalAmount,
          bookingDetails,
        }
      );

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.error(
        "Stripe checkout error:",
        error.response?.data || error.message
      );
      setErrorMessage("Payment failed. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-600">
        Loading hotel details...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans text-gray-800">
      <section id="overview" className="space-y-6 mb-10">
        <HotelOverview hotel={hotel} />
        <HotelRatingAmenities hotel={hotel} />
      </section>

      <SectionNav
        sections={sections}
        activeSection={activeSection}
        onChange={setActiveSection}
      />

      {activeSection === "rooms" && (
        <RoomsSection rooms={rooms} onBookClick={openBookingModal} />
      )}

      {activeSection === "amenities" && (
        <AmenitiesSection
          hotelAmenities={hotel.amenities}
          roomAmenities={rooms?.[0]?.amenities || []}
        />
      )}

      {activeSection === "gallery" && (
        <GallerySection
          images={hotel.images}
          onOpenGallery={openGalleryModal}
        />
      )}

      {galleryModalOpen && (
        <GalleryModal
          images={hotel.images}
          currentIndex={currentImageIndex}
          onClose={closeGalleryModal}
          onPrev={showPrevImage}
          onNext={showNextImage}
        />
      )}

      {activeSection === "reviews" && <ReviewsSection reviews={reviews} />}

      {activeSection === "location" && (
        <LocationSection location={hotel.location} />
      )}

      <SuccessMessage message={successMessage} />

      {showModal && selectedRoom && (
        <BookingModal
          name={name}
          selectedRoom={selectedRoom}
          checkIn={checkIn}
          checkOut={checkOut}
          totalGuests={totalGuests}
          totalRooms={totalRooms}
          errorMessage={errorMessage}
          setCheckIn={setCheckIn}
          setCheckOut={setCheckOut}
          setTotalGuests={setTotalGuests}
          setTotalRooms={setTotalRooms}
          setName={setName}
          onClose={closeModal}
          onSubmit={handleBookingSubmit}
          primaryColor="orange"
        />
      )}
    </div>
  );
};

export default HotelPage;
