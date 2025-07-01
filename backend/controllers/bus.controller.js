import Bus from "../models/Bus/busModel.js"
import Route from "../models/Bus/busRouteModel.js"
import Seat from "../models/Bus/busSeatModel.js"
import BusBooking from "../models/Bus/busBookingModel.js";
import UnifiedBooking from "../models/booking.js"
import updateBusReviewStats from "../models/Bus/reviewHandlerBus.js";
import BusReview from "../models/Bus/busReviewModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getCities = async (req, res) => {
  try {
    const cities = await Route.aggregate([
      {
        $project: {
          allCities: {
            $setUnion: [
              ["$origin", "$destination"],
              "$stops.name"
            ]
          }
        }
      },
      {
        $unwind: "$allCities"
      },
      {
        $group: {
          _id: null,
          uniqueCities: { $addToSet: "$allCities" }
        }
      },
      {
        $project: {
          _id: 0,
          cities: "$uniqueCities"
        }
      }
    ]);

    res.json({ success: true, cities: cities[0]?.cities || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllBuses = async (req, res) => {
  const { origin, destination, day, date, busType, maxPrice } = req.query;

  try {
    const requestedDate = date ? new Date(date) : new Date();
    if (isNaN(requestedDate)) {
      return res.status(400).json({ success: false, message: "Invalid date format. Use YYYY-MM-DD" });
    }
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const travelDay = day || days[requestedDate.getDay()];
    const dateKey = requestedDate.toISOString().split("T")[0];
    let buses = await Bus.find({ ...(busType && { busType }), runningDays: travelDay }).lean();
    let usedFallback = false;
    let fallbackDate = dateKey;
    let fallbackTravelDay = travelDay;
    if (buses.length === 0) {
      usedFallback = true;
      const searchRange = 3;
      let found = false;
      for (let offset = 1; offset <= searchRange && !found; offset++) {
        for (const direction of [-1, 1]) {
          const newDate = new Date(requestedDate);
          newDate.setDate(newDate.getDate() + direction * offset);
          const newDay = days[newDate.getDay()];
          const foundBuses = await Bus.find({ ...(busType && { busType }), runningDays: newDay }).lean();
          if (foundBuses.length > 0) {
            buses = foundBuses;
            fallbackDate = newDate.toISOString().split("T")[0];
            fallbackTravelDay = newDay;
            found = true;
            break;
          }
        }
      }
      if (!found) buses = await Bus.find(busType ? { busType } : {}).lean();
    }

    const formatPath = (route) => [
      route.origin,
      ...(route.stops || []).map((stop) => stop.name),
      route.destination,
    ]
      .filter(Boolean)
      .map(loc => loc.toLowerCase());

    const isPathValid = (o, d, path) => {
      const oi = path.indexOf(o?.toLowerCase());
      const di = path.indexOf(d?.toLowerCase());
      return oi !== -1 && di !== -1 && oi < di;
    };

    const formatTravelTime = (minutes) => {
      if (!minutes) return null;
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${h}h ${m}m`;
    };

    const finalResults = await Promise.all(
      buses.map(async (bus) => {
        const [route, seat] = await Promise.all([
          Route.findOne({ bus: bus._id }).lean(),
          Seat.findOne({ bus: bus._id }).lean(),
        ]);

        if (!route || !seat) return null;

        const path = formatPath(route);
        if (
          (origin && !path.includes(origin.toLowerCase())) ||
          (destination && !path.includes(destination.toLowerCase())) ||
          !isPathValid(origin, destination, path)
        ) {
          return null;
        }

        const originStop = route.stops.find(s => s?.name?.toLowerCase() === origin?.toLowerCase());
        const destinationStop = route.stops.find(s => s?.name?.toLowerCase() === destination?.toLowerCase());

        const departureTime = originStop?.departureTime || null;
        const arrivalTime = destinationStop?.arrivalTime || null;

        let totalTravelTime = null;
        if (departureTime && arrivalTime) {
          const [dh, dm] = departureTime.split(":").map(Number);
          const [ah, am] = arrivalTime.split(":").map(Number);
          const depMin = dh * 60 + dm;
          const arrMin = ah * 60 + am;
          totalTravelTime = arrMin >= depMin ? arrMin - depMin : 1440 - depMin + arrMin;
        }

        const priceOk = !maxPrice || Object.values(seat.prices || {}).some(price => price <= +maxPrice);
        if (!priceOk) return null;

        const bookings = await UnifiedBooking.find({
          bookingType: 'bus',
          status: 'confirmed',
          'details.travellers': {
            $elemMatch: {
              date: new Date(fallbackDate),
              bus: bus._id.toString()
            },
          },
        }).lean();

        const bookedSeats = new Set();
        bookings.forEach(b => {
          (b.details?.travellers || []).forEach(t => {
            const travellerDate = new Date(t.date).toISOString().split("T")[0];
            const travellerSeat = typeof t.seatNumber === "string" ? t.seatNumber.trim() : String(t.seatNumber);
            if (travellerDate === fallbackDate && travellerSeat) {
              bookedSeats.add(travellerSeat);
            }
          });
        });

        const seatTypes = seat.seatTypes || {};
        const prices = seat.prices || {};
        const allSeats = Object.values(seatTypes).flat().map(s => typeof s === "string" ? s.trim() : String(s));

        const availableSeats = allSeats.filter(seat => !bookedSeats.has(seat.trim()));

        const availableByType = {};
        for (const [type, seats] of Object.entries(seatTypes)) {
          availableByType[type] = seats.filter(s => {
            const trimmed = typeof s === "string" ? s.trim() : String(s);
            return !bookedSeats.has(trimmed);
          });
        }

        return {
          _id: bus._id,
          name: bus.name,
          operator: bus.operator,
          busNumber: bus.busNumber,
          busType: bus.busType,
          amenities: bus.amenities,
          runningDays: bus.runningDays,
          route,
          seatTypes,
          prices,
          allSeats,
          totalSeatsCount: allSeats.length,
          availableSeats,
          availableSeatsCount: availableSeats.length,
          availableByType,
          departureTime,
          arrivalTime,
          totalTravelTime: formatTravelTime(totalTravelTime),
          runningOn: fallbackDate,
        };
      })
    );

    const busesToReturn = finalResults.filter(Boolean);

    res.status(200).json({
      success: true,
      buses: busesToReturn,
      fallbackUsed: usedFallback,
      fallbackDate: usedFallback ? fallbackDate : null,
      fallbackTravelDay: usedFallback ? fallbackTravelDay : null,
    });
  } catch (error) {
    console.error("💥 Error in getAllBuses:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};







export const getBusByID = async (req, res) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findById(id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    const routes = await Route.find({ bus: id });
    const seats = await Seat.find({ bus: id });
    res.status(200).json({
      bus,
      routes,
      seats,
    });
  } catch (error) {
    console.error("Error fetching bus details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const createBooking = async (req, res) => {
  try {
    const { session_id } = req.query;
    const userId = req.user?.id;
    if (!session_id) return res.status(400).json({ success: false, message: "Missing Stripe session_id" });
    if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const metadata = session.metadata;
    if (!metadata) return res.status(400).json({ success: false, message: "No booking metadata found in session" });
    const { bookingType, bookingDetails } = metadata;
    if (bookingType !== 'bus') return res.status(400).json({ success: false, message: "Invalid booking type for this route" });
    const { busId, date, selectedSeats, travelers } = JSON.parse(bookingDetails || '{}');
    const totalAmount = session.amount_total / 100;
    if (!busId || !date || !selectedSeats?.length || !travelers?.length) return res.status(400).json({ success: false, message: "Incomplete booking details" });
    const parsedDate = new Date(date);
    const dateKey = parsedDate.toISOString().split('T')[0];
    const bus = await Bus.findById(busId).lean();
    if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });
    const seatDoc = await Seat.findOne({ bus: busId });
    if (!seatDoc) return res.status(404).json({ success: false, message: "Seat data not found for this bus" });
    const allSeats = Object.values(seatDoc.seatTypes || {}).flat();
    const existingBookings = await UnifiedBooking.find({
      bookingType: 'bus',
      status: 'confirmed',
      'details.bus': busId,
      'details.travellers.date': parsedDate,
    }).lean();

    const alreadyBooked = new Set();
    existingBookings.forEach(b => {
      (b.details.travellers || []).forEach(t => {
        if (new Date(t.date).toISOString().split('T')[0] === dateKey && t.seatNumber) {
          alreadyBooked.add(t.seatNumber);
        }
      });
    });
    const allExist = selectedSeats.every(seat => allSeats.includes(seat));
    const allAvailable = selectedSeats.every(seat => !alreadyBooked.has(seat));
    if (!allExist) return res.status(400).json({ success: false, message: "One or more seats are invalid." });
    if (!allAvailable) return res.status(400).json({ success: false, message: "Some seats are already booked." });
    const enrichedTravelers = travelers.map(t => ({ ...t, date: parsedDate, bus: busId, }));
    const newBooking = new UnifiedBooking({
      user: userId,
      bookingType: 'bus',
      status: 'confirmed',
      amount: totalAmount,
      paymentStatus: "paid",
      details: {
        bus: busId,
        journeyDate: parsedDate,
        travellers: enrichedTravelers,
      },
    });
    await newBooking.save();
    return res.status(201).json({ success: true, message: "Bus booking confirmed after payment", booking: newBooking, });
  } catch (err) {
    console.error("❌ confirmBusBooking Error:", err.message);
    return res.status(500).json({ success: false, message: "Booking confirmation failed" });
  }
};


export const addBusWithDetails = async (req, res) => {
  try {
    const { bus, route, seat } = req.body;

    const ownerID = req.user.id;
    if (!ownerID) {
      return res.status(400).json({ error: 'ownerID query param is required' });
    }
    bus.owner = Number(ownerID);

    const requiredFields = ['operator', 'busNumber', 'name', 'busType', 'totalSeats', 'departureTime', 'arrivalTime', 'runningDays'];
    const missingFields = requiredFields.filter(field => !bus[field] || (Array.isArray(bus[field]) && bus[field].length === 0));

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required bus fields: ${missingFields.join(', ')}` });
    }
    const existingBus = await Bus.findOne({ busNumber: bus.busNumber.trim() });
    if (existingBus) {
      return res.status(400).json({ error: `Bus with number "${bus.busNumber}" already exists` });
    }

    const newBus = await Bus.create(bus);

    const newRoute = await Route.create({
      ...route,
      bus: newBus._id
    });

    const newSeat = await Seat.create({
      ...seat,
      bus: newBus._id
    });

    res.status(201).json({
      message: 'Bus, route, and seat details added successfully',
      bus: newBus,
      route: newRoute,
      seat: newSeat
    });

  } catch (err) {
    console.error('Error adding bus:', err);
    res.status(500).json({ error: 'Failed to add bus data' });
  }
};

export const updateBusByID = async (req, res) => {
  try {
    const { id } = req.params;
    const { routes, seats, ...busData } = req.body;

    // Check if bus exists
    const bus = await Bus.findById(id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    // Update bus info
    Object.assign(bus, busData);
    await bus.save();

    // Validate routes array
    if (!routes || !Array.isArray(routes) || routes.length === 0) {
      return res.status(400).json({ message: "Route origin and destination are required" });
    }
    const firstRoute = routes[0];
    if (!firstRoute.origin || !firstRoute.destination) {
      return res.status(400).json({ message: "Route origin and destination are required" });
    }

    // Replace all routes for the bus
    await Route.deleteMany({ bus: id });
    const newRoutes = await Route.insertMany(
      routes.map(route => ({ ...route, bus: id }))
    );

    // Replace all seats for the bus
    await Seat.deleteMany({ bus: id });
    const newSeats = await Seat.insertMany(
      seats.map(seat => ({ ...seat, bus: id }))
    );

    res.status(200).json({
      message: "Bus, Route, and Seat updated successfully",
      bus,
      routes: newRoutes,
      seats: newSeats,
    });
  } catch (error) {
    console.error("Error updating bus:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;
    const booking = await BusBooking.findById(bookingId);

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found." });

    if (booking.userId !== userId)
      return res.status(403).json({ success: false, message: "Unauthorized." });

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: "Booking is already cancelled." });
    }

    const now = new Date();
    const checkIn = new Date(booking.journeyDate);
    const hoursDifference = (checkIn - now) / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      return res.status(400).json({
        success: false,
        message: "Booking can only be cancelled at least 24 hours before check-in."
      });
    }
    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({ success: true, message: "Booking cancelled successfully." });
  } catch (error) {
    console.error("Booking Cancel Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const addBookingReview = async (req, res) => {
  const { targetId, bookingId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  try {
    const bus = await Bus.findById(targetId);
    console.log(bus)
    if (!bus) return res.status(404).json({ message: 'Hotel not found' });

    const booking = await BusBooking.findById(bookingId);
    if (!booking || booking.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized or invalid booking' });
    }

    if (booking.bus.toString() !== targetId) {
      return res.status(400).json({ message: 'Booking does not match hotel' });
    }

    const review = new BusReview({
      bus: targetId,
      booking: bookingId,
      userId,
      rating,
      comment,
    });

    await review.save();
    await updateBusReviewStats(targetId);
    res.status(201).json({ message: 'Review submitted successfully.' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Review already submitted for this booking.' });
    }
    console.error('Review POST error:', err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
}

export const getUserBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await BusBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Error fetching user booking:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

















