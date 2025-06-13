import React from "react";
import { Box, Typography, Button } from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import TripCard from "./TripCard";
import { useNavigate } from "react-router-dom";

const BookingList = ({
  bookings,
  cancelLoading,
  onCancel,
  userReviews,
  openReviewModal,
  hasUserReviewed,
}) => {
  const navigate = useNavigate();

  if (!bookings || bookings.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={6}
        px={2}
        textAlign="center"
        border="1px dashed #ccc"
        borderRadius={4}
        sx={{ backgroundColor: "#fff8f1" }}
      >
        <TravelExploreIcon sx={{ fontSize: 64, color: "#fb8c00", mb: 2 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom color="orange">
          Ahh! You haven’t traveled with us yet
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Start your journey today and explore amazing destinations.
        </Typography>
        <Button
          variant="contained"
          color="warning"
          sx={{ textTransform: "none" }}
          onClick={() => navigate("/")}
        >
          Book Your First Trip
        </Button>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {bookings.map((booking) => {
        const targetId =
          booking.hotel?._id ||
          booking.hotel ||
          booking.bus?._id ||
          booking.bus ||
          (booking.type === "flight" && booking.flights?.[0]?.flight?._id) ||
          (booking.type === "train" && booking.train?._id) ||
          null;

        const showReviewButton =
          !hasUserReviewed(booking.type, targetId) &&
          booking.status.toLowerCase() === "completed";

        return (
          <TripCard
            key={booking._id}
            booking={booking}
            cancelLoading={cancelLoading === booking._id}
            onCancel={() => onCancel(booking._id, booking.type)}
            onReview={() =>
              !hasUserReviewed(booking.type, targetId) &&
              openReviewModal(booking._id, targetId, booking.type)
            }
            hasReviewed={hasUserReviewed}
            showReviewButton={showReviewButton}
            userReviews={userReviews}
          />
        );
      })}
    </Box>
  );
};

export default BookingList;
