import mongoose from 'mongoose';
import Review from './reviewModel.js'; 
import Hotel from './hotelModel.js';   

 async function updateHotelReviewStats(hotelId) {
  // Aggregate reviews for the hotel
  const stats = await Review.aggregate([
    { $match: { hotel: new mongoose.Types.ObjectId(hotelId) } },
    {
      $group: {
        _id: "$hotel",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    // If reviews exist, update rating and count
    await Hotel.findByIdAndUpdate(hotelId, {
      rating: stats[0].averageRating,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    // No reviews: reset values
    await Hotel.findByIdAndUpdate(hotelId, {
      rating: 0,
      reviewCount: 0,
    });
  }
}

export default updateHotelReviewStats