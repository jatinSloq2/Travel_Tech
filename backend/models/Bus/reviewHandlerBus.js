import mongoose from 'mongoose';
import Bus from "./busModel.js"   
import BusReview from './busReviewModel.js';

 async function updateBusReviewStats(targetId) {
  const stats = await BusReview.aggregate([
    { $match: { bus: new mongoose.Types.ObjectId(targetId) } },
    {
      $group: {
        _id: "$bus",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Bus.findByIdAndUpdate(targetId, {
      rating: stats[0].averageRating,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await Bus.findByIdAndUpdate(targetId, {
      rating: 0,
      reviewCount: 0,
    });
  }
}

export default updateBusReviewStats