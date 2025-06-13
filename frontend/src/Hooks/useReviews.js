// hooks/useUserReviews.js
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const useUserReviews = () => {
  const [userReviews, setUserReviews] = useState([]);

  const fetchUserReviews = async () => {
    try {
      const res = await axiosInstance.get("/user/reviews");
      const combinedReviews = [
        ...(res.data.reviews.hotel || []).map(r => ({ ...r, type: "hotel" })),
        ...(res.data.reviews.bus || []).map(r => ({ ...r, type: "bus" })),
        ...(res.data.reviews.flight || []).map(r => ({ ...r, type: "flight" })),
        ...(res.data.reviews.train || []).map(r => ({ ...r, type: "train" })),
      ];
      setUserReviews(combinedReviews);
    } catch (err) {
      console.error("Failed to fetch user reviews", err);
    }
  };

  useEffect(() => {
    fetchUserReviews();
  }, []);

  return { userReviews, fetchUserReviews };
};
