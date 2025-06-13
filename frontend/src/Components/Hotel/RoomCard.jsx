import React, { useState } from "react";
import {
  FaUserFriends,
  FaRupeeSign,
  FaCheckCircle,
  FaRegImage,
} from "react-icons/fa";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const RoomCard = ({ room, onBookClick }) => {
  const images = Array.isArray(room.images) && room.images.length > 0 ? room.images : [];
  const [mainImage, setMainImage] = useState(images[0]);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openGalleryModal = (index) => {
    setSelectedIndex(index);
    setGalleryModalOpen(true);
  };

  const closeGalleryModal = () => setGalleryModalOpen(false);

  const showPrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="bg-white border border-orange-100 rounded-2xl shadow-md hover:shadow-lg transition duration-300 flex flex-col md:flex-row overflow-hidden w-full">
        {/* Image section */}
        <div className="md:w-1/2 w-full bg-gray-50 flex flex-col">
          {mainImage ? (
            <>
              <img
                src={mainImage}
                alt={room.roomType || "Room"}
                className="w-full aspect-video object-cover cursor-pointer"
                onClick={() => openGalleryModal(images.indexOf(mainImage))}
              />
              <div className="flex gap-2 overflow-x-auto px-2 py-2">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumb ${idx + 1}`}
                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 shrink-0 transition ${
                      img === mainImage
                        ? "border-orange-500"
                        : "border-transparent hover:border-orange-400"
                    }`}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-60 w-full bg-gray-100 rounded-t-2xl">
              <div className="text-gray-400 flex flex-col items-center">
                <FaRegImage className="text-4xl mb-2" />
                <p className="text-sm">No image available</p>
              </div>
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="md:w-1/2 w-full p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{room.roomType}</h3>
            <div className="flex items-center text-orange-600 font-semibold mb-1 text-base">
              <FaRupeeSign className="mr-1" />
              {room.pricePerNight}
              <span className="text-sm text-gray-500 ml-1">/night</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <FaUserFriends className="mr-1" />
              Capacity: {room.capacity} guest{room.capacity > 1 && "s"}
            </div>
            <ul className="text-sm text-gray-700 space-y-1 mb-4">
              {room.amenities.map((item, i) => (
                <li key={i} className="flex items-center">
                  <FaCheckCircle className="text-orange-500 mr-2 text-xs" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => onBookClick(room)}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-xl shadow-sm transition"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Gallery Modal */}
      {galleryModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={closeGalleryModal}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeGalleryModal();
            }}
            className="absolute top-4 right-4 text-white hover:text-orange-400 z-60"
            aria-label="Close gallery"
          >
            <X size={32} />
          </button>

          <button
            onClick={showPrev}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-400 z-50"
            aria-label="Previous image"
          >
            <ChevronLeft size={48} />
          </button>

          <img
            src={images[selectedIndex]}
            alt={`Room image ${selectedIndex + 1}`}
            className="max-w-full max-h-[80vh] rounded shadow-xl mx-4"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={showNext}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-400 z-50"
            aria-label="Next image"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </>
  );
};

export default RoomCard;
