import React, { useState } from "react";
import { FaMapMarkerAlt, FaRegImage } from "react-icons/fa";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const HotelOverview = ({ hotel }) => {
  if (!hotel) return null;

  const hasImages = Array.isArray(hotel.images) && hotel.images.length > 0;
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openGallery = (index) => {
    setSelectedIndex(index);
    setGalleryModalOpen(true);
  };

  const closeGallery = () => setGalleryModalOpen(false);

  const prevImage = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) =>
      prev === 0 ? hotel.images.length - 1 : prev - 1
    );
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) =>
      prev === hotel.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 flex flex-col lg:flex-row gap-6 min-h-[22rem]">
        {/* Image Section */}
        <div className="w-full lg:w-1/2">
          {hasImages ? (
            <>
              <img
                src={hotel.images[mainImageIndex]}
                alt="Main Hotel"
                className="w-full h-64 sm:h-72 lg:h-80 object-cover rounded-xl border mb-3 cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                onClick={() => openGallery(mainImageIndex)}
              />
              <div className="flex gap-2 overflow-x-auto pb-1">
                {hotel.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumb ${index + 1}`}
                    onClick={() => {
                      setMainImageIndex(index);
                      openGallery(index);
                    }}
                    className={`min-w-[4.5rem] w-20 h-16 object-cover rounded-md cursor-pointer transition ${
                      mainImageIndex === index
                        ? "border-2 border-orange-500"
                        : "border border-gray-300 hover:border-orange-400"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center bg-gray-100 h-64 rounded-lg border border-dashed border-gray-300 text-gray-400">
              <FaRegImage className="text-4xl mb-2" />
              <span className="text-sm">No images available</span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between py-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
              {hotel.name}
            </h1>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {hotel.description}
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {galleryModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={closeGallery}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeGallery();
            }}
            className="absolute top-4 right-4 text-white hover:text-orange-400 transition-colors z-50"
            aria-label="Close gallery"
          >
            <X size={32} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-3 sm:left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-400 z-50"
            aria-label="Previous image"
          >
            <ChevronLeft size={40} />
          </button>

          <img
            src={hotel.images[selectedIndex]}
            alt={`Gallery ${selectedIndex + 1}`}
            className="w-full max-w-[90vw] max-h-[80vh] rounded shadow-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={nextImage}
            className="absolute right-3 sm:right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-400 z-50"
            aria-label="Next image"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </>
  );
};

export default HotelOverview;
