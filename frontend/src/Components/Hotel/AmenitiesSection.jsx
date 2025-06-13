const AmenitiesSection = ({ hotelAmenities = [], roomAmenities = [] }) => (
  <section id="amenities" className="mt-6">
    <h2 className="text-3xl font-semibold pb-3 mb-6">Amenities</h2>

    {/* Hotel Amenities */}
    {hotelAmenities.length > 0 ? (
      <>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Hotel Amenities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {hotelAmenities.map((item, idx) => (
            <div
              key={`hotel-${idx}`}
              className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <span className="inline-block bg-orange-100 text-orange-600 rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <p className="text-gray-800 font-medium">{item}</p>
            </div>
          ))}
        </div>
      </>
    ) : (
      <p className="text-gray-500 mt-2 italic">No amenities listed for this hotel.</p>
    )}

    {/* Room Amenities */}
    {roomAmenities.length > 0 && (
      <>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Room Amenities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomAmenities.map((item, idx) => (
            <div
              key={`room-${idx}`}
              className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <span className="inline-block bg-orange-100 text-orange-600 rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <p className="text-gray-800 font-medium">{item}</p>
            </div>
          ))}
        </div>
      </>
    )}
  </section>
);

export default AmenitiesSection;
