import RoomCard from "./RoomCard";

const RoomsSection = ({ rooms, onBookClick }) => {
  const hasRooms = rooms && rooms.length > 0;

  return (
    <section id="rooms">
      <h2 className="text-2xl font-semibold border-b border-gray-200 pb-3">
        Choose Your Room
      </h2>
      {!hasRooms ? (
        <div className="mt-6 text-gray-500">No rooms available for this hotel.</div>
      ) : (
        <div className="mt-6 space-y-6">
          <RoomCard room={rooms[0]} onBookClick={onBookClick} />
          {rooms.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.slice(1).map((room) => (
                <RoomCard key={room._id} room={room} onBookClick={onBookClick} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default RoomsSection;
