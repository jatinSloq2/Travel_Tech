import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const AddBusPage = () => {
  const [bus, setBus] = useState({
    operator: '',
    busNumber: '',
    name: '',
    busType: [],
    totalSeats: 0,
    amenities: [''],
    images: [''],
    runningDays: [],
    departureTime: '',
    arrivalTime: '',
  });

  const [route, setRoute] = useState({
    origin: '',
    destination: '',
    stops: [{ name: '', arrivalTime: '', departureTime: '' }],
  });
const BUS_TYPE_OPTIONS = ['AC', 'Non-AC', 'Sleeper', 'Seater'];

  const [seat, setSeat] = useState({
    seatTypes: {
      Seater: [''],
      Sleeper: [''],
      Upper: [''],
      Lower: [''],
    },
    prices: {
      Seater: 0,
      Sleeper: 0,
      Upper: 0,
      Lower: 0,
    },
  });

  const handleDayToggle = (day) => {
    setBus((prev) => ({
      ...prev,
      runningDays: prev.runningDays.includes(day)
        ? prev.runningDays.filter((d) => d !== day)
        : [...prev.runningDays, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = { bus, route, seat };
        console.log(payload)
       const response = await axiosInstance.post('/bus/add', payload);
      alert('Bus data submitted successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit bus data.');
    }
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Bus Details</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bus Info */}
        <input type="text" placeholder="Operator" value={bus.operator} onChange={(e) => setBus({ ...bus, operator: e.target.value })} className="border p-2 w-full" />
        <input type="text" placeholder="Bus Number" value={bus.busNumber} onChange={(e) => setBus({ ...bus, busNumber: e.target.value })} className="border p-2 w-full" />
        <input type="text" placeholder="Bus Name" value={bus.name} onChange={(e) => setBus({ ...bus, name: e.target.value })} className="border p-2 w-full" />
        <input type="number" placeholder="Total Seats" value={bus.totalSeats} onChange={(e) => setBus({ ...bus, totalSeats: parseInt(e.target.value) })} className="border p-2 w-full" />

 {/* Bus Types */}
<div>
  <label className="font-semibold block mb-1">Bus Types</label>
  <div className="flex flex-wrap gap-3">
    {BUS_TYPE_OPTIONS.map((type) => (
      <label key={type} className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={bus.busType.includes(type)}
          onChange={() => {
            setBus((prev) => ({
              ...prev,
              busType: prev.busType.includes(type)
                ? prev.busType.filter((t) => t !== type)
                : [...prev.busType, type],
            }));
          }}
        />
        <span>{type}</span>
      </label>
    ))}
  </div>
</div>

        {/* Amenities */}
        <div>
          <label className="font-semibold block">Amenities</label>
          {bus.amenities.map((a, i) => (
            <input key={i} type="text" value={a} onChange={(e) => {
              const updated = [...bus.amenities];
              updated[i] = e.target.value;
              setBus({ ...bus, amenities: updated });
            }} className="border p-1 w-full my-1" />
          ))}
          <button type="button" onClick={() => setBus({ ...bus, amenities: [...bus.amenities, ''] })} className="bg-blue-500 text-white px-2 py-1 mt-1">+ Add Amenity</button>
        </div>

        {/* Images */}
        <div>
          <label className="font-semibold block">Image URLs</label>
          {bus.images.map((img, i) => (
            <input key={i} type="text" value={img} onChange={(e) => {
              const updated = [...bus.images];
              updated[i] = e.target.value;
              setBus({ ...bus, images: updated });
            }} className="border p-1 w-full my-1" />
          ))}
          <button type="button" onClick={() => setBus({ ...bus, images: [...bus.images, ''] })} className="bg-blue-500 text-white px-2 py-1 mt-1">+ Add Image</button>
        </div>

        {/* Running Days */}
        <div>
          <label className="font-semibold block">Running Days</label>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <label key={day} className="flex items-center space-x-1">
                <input type="checkbox" checked={bus.runningDays.includes(day)} onChange={() => handleDayToggle(day)} />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Departure & Arrival */}
        <input type="text" placeholder="Departure Time (e.g. 22:00)" value={bus.departureTime} onChange={(e) => setBus({ ...bus, departureTime: e.target.value })} className="border p-2 w-full" />
        <input type="text" placeholder="Arrival Time (e.g. 06:00)" value={bus.arrivalTime} onChange={(e) => setBus({ ...bus, arrivalTime: e.target.value })} className="border p-2 w-full" />

        {/* Route Info */}
        <input type="text" placeholder="Origin" value={route.origin} onChange={(e) => setRoute({ ...route, origin: e.target.value })} className="border p-2 w-full" />
        <input type="text" placeholder="Destination" value={route.destination} onChange={(e) => setRoute({ ...route, destination: e.target.value })} className="border p-2 w-full" />

        {/* Route Stops */}
        <div>
          <label className="font-semibold block">Stops</label>
          {route.stops.map((stop, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 my-2">
              <input type="text" placeholder="Stop Name" value={stop.name} onChange={(e) => {
                const updated = [...route.stops];
                updated[i].name = e.target.value;
                setRoute({ ...route, stops: updated });
              }} className="border p-1" />
              <input type="text" placeholder="Arrival Time" value={stop.arrivalTime} onChange={(e) => {
                const updated = [...route.stops];
                updated[i].arrivalTime = e.target.value;
                setRoute({ ...route, stops: updated });
              }} className="border p-1" />
              <input type="text" placeholder="Departure Time" value={stop.departureTime} onChange={(e) => {
                const updated = [...route.stops];
                updated[i].departureTime = e.target.value;
                setRoute({ ...route, stops: updated });
              }} className="border p-1" />
            </div>
          ))}
          <button type="button" onClick={() => setRoute({ ...route, stops: [...route.stops, { name: '', arrivalTime: '', departureTime: '' }] })} className="bg-blue-500 text-white px-2 py-1 mt-1">+ Add Stop</button>
        </div>

        {/* Seat Types */}
        <div>
          <label className="font-semibold block">Seat Types</label>
          {Object.entries(seat.seatTypes).map(([type, values]) => (
            <div key={type}>
              <p className="font-medium mt-2">{type}</p>
              {values.map((val, i) => (
                <input key={i} type="text" value={val} onChange={(e) => {
                  const updated = [...seat.seatTypes[type]];
                  updated[i] = e.target.value;
                  setSeat({ ...seat, seatTypes: { ...seat.seatTypes, [type]: updated } });
                }} className="border p-1 w-full my-1" />
              ))}
              <button type="button" onClick={() => {
                setSeat({ ...seat, seatTypes: { ...seat.seatTypes, [type]: [...seat.seatTypes[type], ''] } });
              }} className="bg-blue-500 text-white px-2 py-1">+ Add {type}</button>
            </div>
          ))}
        </div>

        {/* Seat Prices */}
        <div>
          <label className="font-semibold block">Seat Prices</label>
          {Object.keys(seat.prices).map((type) => (
            <div key={type} className="flex items-center gap-2">
              <span>{type}:</span>
              <input type="number" value={seat.prices[type]} onChange={(e) => {
                setSeat({ ...seat, prices: { ...seat.prices, [type]: parseInt(e.target.value) } });
              }} className="border p-1 w-32" />
            </div>
          ))}
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default AddBusPage;
