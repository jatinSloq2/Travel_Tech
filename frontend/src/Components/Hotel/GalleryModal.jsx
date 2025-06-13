import { XCircleIcon } from "lucide-react";

const GalleryModal = ({ images, currentIndex, onClose, onPrev, onNext }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <div
      className="relative max-w-4xl max-h-[90vh] p-4 flex items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-50 text-white text-3xl font-bold hover:text-orange-400"
        aria-label="Close gallery"
      >
        <XCircleIcon size={28} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="text-white text-4xl px-3 select-none hover:text-orange-400"
        aria-label="Previous image"
      >
        &#10094;
      </button>

      <img
        src={images[currentIndex]}
        alt={`Selected Hotel ${currentIndex + 1}`}
        className="max-w-full max-h-[80vh] rounded shadow-lg mx-4"
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="text-white text-4xl px-3 select-none hover:text-orange-400"
        aria-label="Next image"
      >
        &#10095;
      </button>
    </div>
  </div>
);

export default GalleryModal;
