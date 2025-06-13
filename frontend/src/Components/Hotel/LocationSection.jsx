const LocationSection = ({ location }) => (
  <section id="location">
    <h2 className="text-2xl font-semibold border-b border-gray-200 pb-3">Location</h2>
    <div className="mt-4 w-full h-96 rounded overflow-hidden shadow">
      <iframe
        title="Hotel Location"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAtuvQ-oQZhhW3-sdCYKGIe8Ns-RX5eD0M&q=${encodeURIComponent(
          location || "New Delhi, India"
        )}`}
      ></iframe>
    </div>
  </section>
);

export default LocationSection;
