import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams } from "react-router-dom";

const EditBus = () => {
  const { busId } = useParams();

  const [busData, setBusData] = useState({
    operator: "",
    busNumber: "",
    name: "",
    busType: [],
    totalSeats: "",
    amenities: [],
    images: [],
    runningDays: [],
    departureTime: "",
    arrivalTime: "",
  });

  const [routeData, setRouteData] = useState({
    origin: "",
    destination: "",
    stops: [{ name: "", arrivalTime: "", departureTime: "" }],
  });

  const [seatData, setSeatData] = useState([
    {
      seatTypes: { Seater: [], Sleeper: [], Upper: [], Lower: [] },
      prices: { Seater: 0, Sleeper: 0, Upper: 0, Lower: 0 },
    },
  ]);

  const [seatInputs, setSeatInputs] = useState({
    Seater: "",
    Sleeper: "",
    Upper: "",
    Lower: "",
  });

  useEffect(() => {
    if (!busId) return;

    const fetchBusData = async () => {
      try {
        const { data } = await axiosInstance.get(`/bus/bus/${busId}`);

        const fetchedSeats = data.seats?.length
          ? data.seats
          : [
              {
                seatTypes: { Seater: [], Sleeper: [], Upper: [], Lower: [] },
                prices: { Seater: "", Sleeper: "", Upper: "", Lower: "" },
                bookedSeatsByDate: {},
              },
            ];

        setSeatData(fetchedSeats);

        setBusData({
          operator: data.bus?.operator || "",
          busNumber: data.bus?.busNumber || "",
          name: data.bus?.name || "",
          busType: data.bus?.busType || [],
          totalSeats: data.bus?.totalSeats || "",
          amenities: data.bus?.amenities || [],
          images: data.bus?.images || [],
          runningDays: data.bus?.runningDays || [],
          departureTime: data.bus?.departureTime || "",
          arrivalTime: data.bus?.arrivalTime || "",
        });

        setRouteData({
          origin: data.routes?.[0]?.origin || "",
          destination: data.routes?.[0]?.destination || "",
          stops: data.routes?.[0]?.stops?.length
            ? data.routes[0].stops
            : [{ name: "", arrivalTime: "", departureTime: "" }],
        });

        setSeatInputs({
          Seater: fetchedSeats[0].seatTypes.Seater.join(", "),
          Sleeper: fetchedSeats[0].seatTypes.Sleeper.join(", "),
          Upper: fetchedSeats[0].seatTypes.Upper.join(", "),
          Lower: fetchedSeats[0].seatTypes.Lower.join(", "),
        });
      } catch (error) {
        console.error("Failed to fetch bus data:", error);
      }
    };

    fetchBusData();
  }, [busId]);

  const handleBusChange = (e) => {
    const { name, value } = e.target;
    setBusData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    const values = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setBusData((prev) => ({ ...prev, [field]: values }));
  };

  const handleRouteChange = (e) => {
    const { name, value } = e.target;
    setRouteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStopChange = (index, e) => {
    const { name, value } = e.target;
    setRouteData((prev) => {
      const stops = [...prev.stops];
      stops[index] = { ...stops[index], [name]: value };
      return { ...prev, stops };
    });
  };

  const addStop = () => {
    setRouteData((prev) => ({
      ...prev,
      stops: [...prev.stops, { name: "", arrivalTime: "", departureTime: "" }],
    }));
  };

  const removeStop = (index) => {
    setRouteData((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index),
    }));
  };

  const handleSeatInputChange = (type, e) => {
    setSeatInputs((prev) => ({ ...prev, [type]: e.target.value }));
  };

  const handleSeatInputBlur = (type) => {
    const updatedSeats = seatInputs[type]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setSeatData((prev) => {
      const newSeatData = [...prev];
      newSeatData[0] = {
        ...newSeatData[0],
        seatTypes: { ...newSeatData[0].seatTypes, [type]: updatedSeats },
      };
      return newSeatData;
    });
  };

  const handleSeatPriceChange = (category, e) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setSeatData((prev) => {
      const newSeatData = [...prev];
      newSeatData[0] = {
        ...newSeatData[0],
        prices: { ...newSeatData[0].prices, [category]: value },
      };
      return newSeatData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const origin = routeData.origin.trim();
    const destination = routeData.destination.trim();

    if (!origin || !destination) {
      alert("Route origin and destination are required.");
      return;
    }

    const cleanedStops = routeData.stops
      .filter((stop) => stop.name.trim())
      .map((stop) => ({
        name: stop.name.trim(),
        arrivalTime: stop.arrivalTime,
        departureTime: stop.departureTime,
      }));

    const payload = {
      ...busData,
      routes: [{ origin, destination, stops: cleanedStops }],
      seats: seatData.map((seat) => ({
        seatTypes: seat.seatTypes,
        prices: seat.prices,
        bookedSeatsByDate: seat.bookedSeatsByDate || {},
      })),
    };

    try {
      await axiosInstance.put(`/bus/bus/edit/${busId}`, payload);
      alert("Bus info updated successfully");
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      alert(
        "Failed to update bus info: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-md shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Edit Bus Info
      </h2>

      {/* Bus Details Section */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
          Bus Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="operator"
            placeholder="Operator"
            value={busData.operator}
            onChange={handleBusChange}
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="busNumber"
            placeholder="Bus Number"
            value={busData.busNumber}
            onChange={handleBusChange}
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="name"
            placeholder="Bus Name"
            value={busData.name}
            onChange={handleBusChange}
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2"
          />
          <input
            type="text"
            placeholder="Bus Types (comma separated)"
            defaultValue={busData.busType.join(", ")}
            onBlur={(e) => handleArrayChange(e, "busType")}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2"
          />
          <input
            type="number"
            name="totalSeats"
            placeholder="Total Seats"
            value={busData.totalSeats}
            onChange={handleBusChange}
            required
            min={1}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Amenities (comma separated)"
            defaultValue={busData.amenities.join(", ")}
            onBlur={(e) => handleArrayChange(e, "amenities")}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2"
          />
          <input
            type="text"
            placeholder="Images URLs (comma separated)"
            defaultValue={busData.images.join(", ")}
            onBlur={(e) => handleArrayChange(e, "images")}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2"
          />
          <input
            type="text"
            placeholder="Running Days (comma separated)"
            defaultValue={busData.runningDays.join(", ")}
            onBlur={(e) => handleArrayChange(e, "runningDays")}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2"
          />
          <input
            type="time"
            name="departureTime"
            placeholder="Departure Time"
            value={busData.departureTime}
            onChange={handleBusChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="time"
            name="arrivalTime"
            placeholder="Arrival Time"
            value={busData.arrivalTime}
            onChange={handleBusChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </section>

      {/* Route Details Section */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
          Route Details
        </h3>
        <div className="mb-4">
          <input
            name="origin"
            placeholder="Origin"
            value={routeData.origin}
            onChange={handleRouteChange}
            required
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <input
            name="destination"
            placeholder="Destination"
            value={routeData.destination}
            onChange={handleRouteChange}
            required
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <h4 className="font-semibold mb-2">Stops</h4>
          {routeData.stops.map((stop, idx) => (
            <div
              key={idx}
              className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
            >
              <input
                name="name"
                placeholder="Stop Name"
                value={stop.name}
                onChange={(e) => handleStopChange(idx, e)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                name="arrivalTime"
                type="time"
                placeholder="Arrival Time"
                value={stop.arrivalTime}
                onChange={(e) => handleStopChange(idx, e)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                name="departureTime"
                type="time"
                placeholder="Departure Time"
                value={stop.departureTime}
                onChange={(e) => handleStopChange(idx, e)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => removeStop(idx)}
                className="text-red-600 hover:underline"
                disabled={routeData.stops.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStop}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Add Stop
          </button>
        </div>
      </section>

      {/* Seats Section */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
          Seat Types & Prices
        </h3>
        {["Seater", "Sleeper", "Upper", "Lower"].map((type) => (
          <div key={type} className="mb-4">
            <label className="block font-medium mb-1">
              {type} Seats (comma separated):
            </label>
            <input
              type="text"
              value={seatInputs[type]}
              onChange={(e) => handleSeatInputChange(type, e)}
              onBlur={() => handleSeatInputBlur(type)}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label className="block font-medium mt-2 mb-1">
              {type} Seat Price:
            </label>
            <input
              type="number"
              min="0"
              value={seatData[0]?.prices[type] ?? ""}
              onChange={(e) => handleSeatPriceChange(type, e)}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}
      </section>

      <button
        type="submit"
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Update Bus
      </button>
    </form>
  );
};

export default EditBus;
