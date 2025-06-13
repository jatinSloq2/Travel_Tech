import { FaStar } from "react-icons/fa";

const HotelRatingAmenities = ({ hotel }) => {
  const maxStars = 5;
  const rating = hotel.rating ? Math.min(Math.max(hotel.rating, 0), 5) : 4.0;
  const fullStars = Math.floor(rating);

  return (
    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Star Rating & Review Count */}
      <div className="flex items-center space-x-2" aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`}>
        <div className="flex items-center">
          {[...Array(maxStars)].map((_, i) => (
            <FaStar
              key={i}
              className={`h-5 w-5 transition-colors duration-300 ${
                i < fullStars ? "text-orange-500" : "text-gray-300"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
        <span className="font-semibold text-gray-800 text-base md:text-lg">{rating.toFixed(1)}</span>
        <span className="text-sm text-gray-500">
          ({hotel.reviewCount ?? 128} review{(hotel.reviewCount ?? 128) > 1 ? "s" : ""})
        </span>
      </div>

      {/* Amenities */}
      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 max-w-full sm:max-w-[60%]">
        {hotel.amenities?.slice(0, 4).map((amenity, idx) => (
          <span
            key={idx}
            className="bg-orange-50 text-orange-600 text-xs sm:text-sm font-medium px-3 py-1 rounded-full border border-orange-200 cursor-default select-none
                       hover:bg-orange-100 transition"
            title={amenity}
          >
            {amenity}
          </span>
        ))}
        {hotel.amenities?.length > 4 && (
          <span className="text-xs sm:text-sm text-gray-500 self-center select-none">
            +{hotel.amenities.length - 4} more
          </span>
        )}
      </div>
    </div>
  );
};

export default HotelRatingAmenities;
