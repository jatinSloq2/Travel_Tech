const ReviewModal = ({
  rating,
  reviewText,
  onClose,
  onSubmit,
  onRatingChange,
  onTextChange,
  submitting,
  name,
  onNameChange
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Share Your Review</h2>

        <label className="block mb-2 font-medium text-gray-700">Name</label>

        <input
  type="text"
  placeholder="Your Name"
  className="border px-4 py-2 w-full rounded mb-4"
  value={name}
  onChange={(e) => onNameChange(e.target.value)}
/>
        <label className="block mb-2 font-medium text-gray-700">Rating</label>
        <select
          value={rating}
          onChange={(e) => onRatingChange(Number(e.target.value))}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        >
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star}>{star} Star{star > 1 ? "s" : ""}</option>
          ))}
        </select>

        <label className="block mb-2 font-medium text-gray-700">Comment</label>
        <textarea
          value={reviewText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Write your thoughts..."
          className="w-full h-32 p-3 border border-gray-300 rounded resize-none mb-4"
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
