const ReviewsSection = ({ reviews = [] }) => (
  <section id="reviews" className="mt-6 max-w-3xl">
    <h2 className="text-2xl font-semibold border-b border-gray-200 pb-3">Reviews</h2>

    {reviews.length > 0 ? (
      <ul className="mt-4 space-y-6">
        {reviews.map((review, idx) => (
          <li key={idx} className="border rounded p-4 shadow-sm bg-white">
            <div className="flex items-center mb-2">
              <strong className="text-lg text-gray-800 mr-2">
                {review.reviewerName || "Anonymous"}
              </strong>
              <span className="text-yellow-500 font-bold">
                {"⭐".repeat(review.rating || 5)}
              </span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <small className="text-gray-400 mt-1 block">
              {new Date(review.createdAt).toLocaleDateString()}
            </small>
          </li>
        ))}
      </ul>
    ) : (
      <p className="mt-4 text-gray-600">No reviews available yet.</p>
    )}
  </section>
);

export default ReviewsSection;
