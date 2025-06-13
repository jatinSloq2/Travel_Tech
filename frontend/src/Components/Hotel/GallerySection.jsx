const GallerySection = ({ images = [], onOpenGallery }) => (
  <section id="gallery">
    <h2 className="text-2xl font-semibold border-b border-gray-200 pb-3">🖼️ More Images</h2>
    {images.length > 0 ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Hotel Image ${i}`}
            className="w-full h-48 object-cover rounded shadow cursor-pointer hover:opacity-80 transition"
            onClick={() => onOpenGallery(i)}
          />
        ))}
      </div>
    ) : (
      <p className="text-gray-500 mt-2">No additional images provided.</p>
    )}
  </section>
);

export default GallerySection;
