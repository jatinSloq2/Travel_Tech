import { useState } from "react";
import { useBookings } from "../Hooks/useBookings";
import { useUserReviews } from "../Hooks/useReviews";
import FilterControls from "../Components/MyTrips/FilterControls";
import BookingList from "../Components/MyTrips/BookingList";
import ReviewModal from "../Components/MyTrips/ReviewModal";
import axiosInstance from "../utils/axiosInstance";

const MyTrips = () => {
  const { bookings, fetchBookings } = useBookings();
  const { userReviews, fetchUserReviews } = useUserReviews();

  const [cancelLoading, setCancelLoading] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleCancelBooking = async (bookingId) => {
  if (!window.confirm("Are you sure you want to cancel this booking?")) return;

  try {
    setCancelLoading(bookingId);

    // Unified endpoint
    const endpoint = `/user/booking/${bookingId}/cancel`;

    await axiosInstance.patch(endpoint);
    await fetchBookings(); // Refresh the bookings list
  } catch (err) {
    alert(err.response?.data?.message || "Failed to cancel booking.");
  } finally {
    setCancelLoading(null);
  }
};

  const hasUserReviewed = (type, itemId) =>
    userReviews.some(
      (review) =>
        review.type === type &&
        review[type]?._id?.toString() === itemId?.toString()
    );

  const openReviewModal = (bookingId, itemId, type) => {
    setSelectedBookingId(bookingId);
    setSelectedType(type);
    setSelectedItemId(itemId);
    setReviewText("");
    setRating(5);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedBookingId(null);
    setSelectedType(null);
    setSelectedItemId(null);
  };

  const submitReview = async () => {
    if (!reviewText.trim()) return alert("Please provide a comment.");
    if (!name.trim()) return alert("Please enter your name.");

    try {
      setSubmittingReview(true);
      const url = `/${selectedType}/review/${selectedItemId}/${selectedBookingId}`;
      await axiosInstance.post(url, { rating, comment: reviewText });
      alert("Thank you for your feedback!");
      await fetchUserReviews();
      closeReviewModal();
    } catch (err) {
      if (err.response?.status === 409) {
        alert(`You already reviewed this ${selectedType}.`);
      } else {
        alert("Failed to submit review.");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const getDateRange = (filter) => {
    const now = new Date();
    const start = new Date();
    const end = new Date();

    switch (filter) {
      case "thisMonth":
        start.setDate(1);
        end.setMonth(now.getMonth() + 1, 0);
        break;
      case "lastMonth":
        start.setMonth(now.getMonth() - 1, 1);
        end.setMonth(now.getMonth(), 0);
        break;
      case "thisYear":
        start.setMonth(0, 1);
        end.setMonth(11, 31);
        break;
      case "lastYear":
        start.setFullYear(now.getFullYear() - 1, 0, 1);
        end.setFullYear(now.getFullYear() - 1, 11, 31);
        break;
      default:
        return null;
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return [start, end];
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesType = filterType === "all" || booking.type === filterType;

    const dateToCheck = new Date(
      booking.journeyDate || booking.startDate || booking.createdAt
    );

    if (!filterDate) return matchesType;

    const range = getDateRange(filterDate);
    const matchesDate = range
      ? dateToCheck >= range[0] && dateToCheck <= range[1]
      : true;

    return matchesType && matchesDate;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-10">
        My Trips
      </h1>

      <FilterControls
        filterType={filterType}
        setFilterType={setFilterType}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        onReset={() => {
          setFilterType("all");
          setFilterDate("");
          fetchBookings();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      <BookingList
        bookings={filteredBookings}
        cancelLoading={cancelLoading}
        onCancel={handleCancelBooking}
        userReviews={userReviews}
        openReviewModal={openReviewModal}
        hasUserReviewed={hasUserReviewed}
      />

      {showReviewModal && (
        <ReviewModal
          name={name}
          rating={rating}
          reviewText={reviewText}
          onClose={closeReviewModal}
          onSubmit={submitReview}
          onRatingChange={setRating}
          onTextChange={setReviewText}
          onNameChange={setName}
          submitting={submittingReview}
        />
      )}
    </div>
  );
};

export default MyTrips;
