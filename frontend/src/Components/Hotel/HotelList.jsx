import HotelCard from "./HotelCard";

const HotelList = ({ hotels, onHotelClick }) => {
  return (
    <div className="space-y-6">
      {hotels.map((hotel) => (
        <HotelCard
          key={hotel._id}
          hotel={hotel}
          onClick={() => onHotelClick(hotel._id)}
        />
      ))}
    </div>
  );
};
export default HotelList;
