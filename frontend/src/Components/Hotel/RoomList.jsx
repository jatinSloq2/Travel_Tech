const RoomList = ({ rooms, onBookClick }) => (
  <div className="w-full max-w-4xl mx-auto px-4">
    {rooms.map((room) => (
      <RoomCard key={room.id} room={room} onBookClick={onBookClick} />
    ))}
  </div>
);
export default RoomList