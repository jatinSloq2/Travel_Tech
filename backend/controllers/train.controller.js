import mongoose from "mongoose";
import Station from "../models/Train/stationModel.js";
import Train from "../models/Train/trainModel.js";
import TrainBooking from "../models/Train/trainBookingModel.js";
import TrainSeat from "../models/Train/trainSeatModel.js"
import TrainBookingReview from "../models/Train/trainBookingModel.js"
import UnifiedBooking from "../models/booking.js"
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getAllCities = async (req, res) => {
  try {
    const result = await Station.find();
    res.json({ stations: result });
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTrains = async (req, res) => {
  const { stations, departureDate: date } = req.query;
  try {
    if (!stations || !date) return res.status(400).json({ error: "`stations` and `date` query params are required", });
    const [originName, destinationName] = stations.split(",").map((s) => s?.trim());
    if (!originName || !destinationName) {
      return res.status(400).json({
        error: "`stations` must contain two station names separated by a comma",
      });
    }
    const stationsInDB = await Station.find();
    const normalizeName = (name) => name.trim().toLowerCase().replace(/\s+/g, "");
    const findStation = (inputName) => {
      const normInput = normalizeName(inputName);
      return stationsInDB.find((st) => normalizeName(st.name) === normInput);
    };
    const originStation = findStation(originName);
    const destinationStation = findStation(destinationName);
    if (!originStation || !destinationStation) return res.status(404).json({ error: "One or both stations not found" });
    const originIdStr = originStation._id.toString();
    const destinationIdStr = destinationStation._id.toString();
    const trains = await Train.find({
      isActive: true,
      route: {
        $all: [
          { $elemMatch: { station: originStation._id } },
          { $elemMatch: { station: destinationStation._id } },
        ],
      },
    }).populate("route.station", "name code");

    const filteredTrains = trains.filter((train) => {
      const route = train.route || [];
      const originIndex = route.findIndex((stop) => stop.station?._id?.toString() === originIdStr);
      const destIndex = route.findIndex((stop) => stop.station?._id?.toString() === destinationIdStr);
      return originIndex !== -1 && destIndex !== -1 && originIndex < destIndex;
    });

    const requestedDate = new Date(date);
    if (isNaN(requestedDate)) return res.status(400).json({ error: "Invalid date format" });
    const dayShort = requestedDate.toLocaleString("en-US", { weekday: "short" });
    const dayFull = requestedDate.toLocaleString("en-US", { weekday: "long" });
    const trainsOnDate = filteredTrains.filter((train) => {
      const ops = train.operatingDays || [];
      const matched = ops.some((d) =>
        d.toLowerCase().startsWith(dayShort.toLowerCase()) ||
        d.toLowerCase() === dayFull.toLowerCase()
      );
      return matched;
    });
    res.json({ trains: trainsOnDate });
  } catch (error) {
    console.error("💥 Error fetching trains:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTrainById = async (req, res) => {
  const { trainId, date } = req.query;
  if (!date) return res.status(400).json({ message: 'Date is required in YYYY-MM-DD format' });
  if (!trainId || !mongoose.Types.ObjectId.isValid(trainId)) return res.status(400).json({ message: 'Valid trainId query parameter is required' });
  const queryDate = new Date(date);
  if (isNaN(queryDate.getTime())) return res.status(400).json({ message: 'Invalid date format' });
  const startDate = new Date(Date.UTC(queryDate.getUTCFullYear(), queryDate.getUTCMonth(), queryDate.getUTCDate()));
  const endDate = new Date(Date.UTC(queryDate.getUTCFullYear(), queryDate.getUTCMonth(), queryDate.getUTCDate() + 1));
  try {
    const train = await Train.findById(trainId)
      .populate('route.station', 'name code')
      .lean();
    if (!train) return res.status(404).json({ message: `Train ${trainId} not found` });
    const bookings = await UnifiedBooking.find({
      bookingType: 'train',
      status: 'confirmed',
      'details.train': trainId,
      'details.travelers.date': { $gte: startDate, $lt: endDate },
    }).lean();
    const bookedCountByClass = {};
    bookings.forEach((booking, bIndex) => {
      const travelers = booking.details?.travelers || [];
      travelers.forEach((traveler, tIndex) => {
        const travelerTrainId = traveler.train?.toString();
        const travelerDate = new Date(traveler.date);
        if (
          travelerTrainId === trainId.toString() &&
          travelerDate >= startDate &&
          travelerDate < endDate
        ) {
          const seatClass = traveler.seatType;
          bookedCountByClass[seatClass] = (bookedCountByClass[seatClass] || 0) + 1;
        }
      });
    });
    const seatTypes = (train.seatTypes || []).map(seatType => {
      const booked = bookedCountByClass[seatType.class] || 0;
      const available = Math.max(seatType.totalSeats - booked, 0);
      return {
        class: seatType.class,
        fare: seatType.fare,
        totalSeats: seatType.totalSeats,
        availableCount: available,
      };
    });
    const response = {
      trainId: train._id.toString(),
      trainNumber: train.trainNumber,
      name: train.name,
      from: train.route[0]?.station || {},
      to: train.route[train.route.length - 1]?.station || {},
      date: startDate.toISOString().split('T')[0],
      operatingDays: train.operatingDays,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      duration: train.duration,
      seatTypes,
      route: train.route.map(stop => ({
        station: stop.station,
        arrivalTime: stop.arrivalTime,
        departureTime: stop.departureTime,
        distance: stop.distance,
        dayOffset: stop.dayOffset,
      })),
    };
    return res.status(200).json({ success: true, train: response });
  } catch (err) {
    console.error('💥 Error fetching train details:', err);
    return res.status(500).json({ message: 'Failed to fetch train details' });
  }
};

export const createBooking = async (req, res) => {
  const { session_id } = req.query;
  const userId = req.user?.id
  if (!session_id) return res.status(400).json({ message: "Missing session_id" });
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const metadata = session.metadata;
    if (!metadata?.bookingType || metadata.bookingType !== "train") return res.status(400).json({ message: "Invalid or missing booking type in session" });
    const existing = await UnifiedBooking.findOne({
      bookingType: "train",
      "stripe.sessionId": session_id,
    });

    if (existing) return res.status(200).json({ success: true, message: "Already booked", booking: existing });
    const bookingDetails = JSON.parse(metadata.bookingDetails);
    const { trainId, date, travelers } = bookingDetails;
    if (!trainId || !mongoose.Types.ObjectId.isValid(trainId)) return res.status(400).json({ message: "Invalid train ID" });
    if (!date || !Array.isArray(travelers) || travelers.length === 0) return res.status(400).json({ message: "Date and travelers are required" });
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) return res.status(400).json({ message: "Invalid date format" });
    const seatDocsByClass = {};
    const seatTypeCountMap = {};
    const train = await Train.findById(trainId).lean();
    if (!train) return res.status(404).json({ message: "Train not found" });
    for (const traveler of travelers) {
      if (!traveler.seatType) return res.status(400).json({ message: "Seat type missing for traveler" });
      seatTypeCountMap[traveler.seatType] = (seatTypeCountMap[traveler.seatType] || 0) + 1;
    }

    for (const seatType in seatTypeCountMap) {
      const requiredSeats = seatTypeCountMap[seatType];
      const seatDoc = await TrainSeat.findOne({ train: trainId, class: seatType });

      if (!seatDoc) return res.status(404).json({ message: `Seat data not found for class ${seatType}` });
      const availableSeats = seatDoc.seats.filter(seat => {
        const bookingForDate = seat.bookings.find(b =>
          new Date(b.date).toISOString().slice(0, 10) === bookingDate.toISOString().slice(0, 10)
        );
        return !bookingForDate || !bookingForDate.isBooked;
      });

      if (availableSeats.length < requiredSeats) {
        return res.status(400).json({
          message: `Only ${availableSeats.length} seats available in ${seatType}, but ${requiredSeats} requested.`,
        });
      }
      seatDocsByClass[seatType] = seatDoc;
    }
    const assignedTravelers = [];
    for (const traveler of travelers) {
      const seatDoc = seatDocsByClass[traveler.seatType];
      let assignedSeat = null;
      for (const seat of seatDoc.seats) {
        const bookingForDate = seat.bookings.find(b =>
          new Date(b.date).toISOString().slice(0, 10) === bookingDate.toISOString().slice(0, 10)
        );
        if (!bookingForDate) {
          seat.bookings.push({ date: bookingDate, isBooked: true });
          assignedSeat = seat.seatNumber;
          break;
        } else if (!bookingForDate.isBooked) {
          bookingForDate.isBooked = true;
          assignedSeat = seat.seatNumber;
          break;
        }
      }
      if (!assignedSeat) return res.status(400).json({ message: `Seat assignment failed for ${traveler.seatType}` });
      assignedTravelers.push({
        ...traveler,
        seatNo: assignedSeat,
        train: trainId,
        date: bookingDate,
      });
      await seatDocsByClass[traveler.seatType].save();
    }
    let totalAmount = 0;
    for (const traveler of assignedTravelers) {
      const seatTypeInfo = train.seatTypes.find(s => s.class === traveler.seatType);
      if (!seatTypeInfo) {
        return res.status(400).json({ message: `Seat type '${traveler.seatType}' not found in train` });
      }
      totalAmount += seatTypeInfo.fare;
    }
    const unifiedBooking = new UnifiedBooking({
      user: userId,
      bookingType: "train",
      status: "confirmed",
      amount: totalAmount,
      stripe: { sessionId: session_id },
      details: {
        train: trainId,
        date: bookingDate,
        travelers: assignedTravelers,
      },
    });

    await unifiedBooking.save();
    return res.status(201).json({ success: true, booking: unifiedBooking });
  } catch (error) {
    console.error("💥 Error during booking:", error);
    return res.status(500).json({ message: "Failed to create booking" });
  }
};

export const cancelBooking = async (req, res) => {
  const userId = req.user.id;
  const bookingId = req.params.id;
  try {
    const booking = await TrainBooking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    if (booking.user !== userId) return res.status(403).json({ success: false, message: "Unauthorized." });
    if (booking.status === 'Cancelled') return res.status(400).json({ success: false, message: "Booking is already cancelled." });
    res.status(200).json({ success: true, message: "Booking cancelled successfully." });
    booking.status = 'Cancelled';
    await booking.save();
  } catch (error) {
    console.error('Error cancelling the booking :', error);
    res.status(500).json({ message: 'Failed to cancel the booking' });
  }
}

export const addBookingReveiw = async (req, res) => {
  const userId = req.user.id;
  const { bookingId, trainId, ratingNo, comment } = req.body;
  if (!bookingId || !trainId || !ratingNo) return res.status(400).json({ message: 'bookingId, trainId, and ratingNo are required' });
  if (ratingNo < 1 || ratingNo > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  try {
    const booking = TrainBookingReview.findOne({ _id: bookingId, user: userId }).lean();
    if (!booking) return res.status(404).json({ message: 'Booking not found for this user' });
    if (booking.status !== 'Completed') return res.status(400).json({ message: 'Review can only be added for completed bookings' });
    const existingReview = await TrainBookingReview.findOne({ booking: bookingId });
    if (existingReview) return res.status(409).json({ message: 'Review already exists for this booking' });
    const newReview = new TrainBookingReview({
      train: trainId,
      booking: bookingId,
      user: userId,
      rating: ratingNo,
      comment: comment?.trim() || '',
    });
    await newReview.save();
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Failed to add review for booking' });
  }
}


export const createmBooking = async (req, res) => {
  const userId = req.user.id;
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ message: "Missing session_id" });
  const { trainId, date, travelers } = req.body;
  if (!trainId || !mongoose.Types.ObjectId.isValid(trainId)) return res.status(400).json({ message: "Invalid train ID" });
  if (!date || !Array.isArray(travelers) || travelers.length === 0) return res.status(400).json({ message: "Date and travelers are required" });
  const bookingDate = new Date(date);
  if (isNaN(bookingDate.getTime())) return res.status(400).json({ message: "Invalid date format" });
  try {
    const seatDocsByClass = {};
    const seatTypeCountMap = {};
    for (const traveler of travelers) {
      if (!traveler.seatType) return res.status(400).json({ message: "Seat type missing for traveler" });
      seatTypeCountMap[traveler.seatType] = (seatTypeCountMap[traveler.seatType] || 0) + 1;
    }
    for (const seatType in seatTypeCountMap) {
      const requiredSeats = seatTypeCountMap[seatType];
      const seatDoc = await TrainSeat.findOne({ train: trainId, class: seatType, });
      if (!seatDoc) return res.status(404).json({ message: `Seat data not found for class ${seatType}` });
      const availableSeats = seatDoc.seats.filter(seat => {
        const bookingForDate = seat.bookings.find(
          b => new Date(b.date).toISOString().slice(0, 10) === bookingDate.toISOString().slice(0, 10)
        );
        return !bookingForDate || !bookingForDate.isBooked;
      });

      if (availableSeats.length < requiredSeats) {
        return res.status(400).json({
          message: `Only ${availableSeats.length} seats available in ${seatType}, but ${requiredSeats} requested.`,
        });
      }
      seatDocsByClass[seatType] = seatDoc;
    }
    const train = await Train.findById(trainId).lean();
    if (!train) return res.status(404).json({ message: "Train not found" });
    const assignedTravelers = [];
    for (const traveler of travelers) {
      const seatDoc = seatDocsByClass[traveler.seatType];
      let assignedSeat = null;

      for (const seat of seatDoc.seats) {
        const bookingForDate = seat.bookings.find(b =>
          new Date(b.date).toISOString().slice(0, 10) === bookingDate.toISOString().slice(0, 10)
        );

        if (!bookingForDate) {
          seat.bookings.push({ date: bookingDate, isBooked: true });
          assignedSeat = seat.seatNumber;
          break;
        } else if (!bookingForDate.isBooked) {
          bookingForDate.isBooked = true;
          assignedSeat = seat.seatNumber;
          break;
        }
      }
      if (!assignedSeat) return res.status(400).json({ message: `Seat assignment failed for ${traveler.seatType}` });
      assignedTravelers.push({ ...traveler, seatNo: assignedSeat, train: trainId, date: bookingDate, });
      await seatDoc.save();
    }
    let totalAmount = 0;
    for (const traveler of assignedTravelers) {
      const seatTypeInfo = train.seatTypes.find(s => s.class === traveler.seatType);
      if (!seatTypeInfo) return res.status(400).json({ message: `Seat type '${traveler.seatType}' not found in train` });
      totalAmount += seatTypeInfo.fare;
    }
    const unifiedBooking = new UnifiedBooking({ user: userId, bookingType: 'train', status: 'confirmed', amount: totalAmount, details: { train: trainId, date: bookingDate, travelers: assignedTravelers, }, });
    await unifiedBooking.save();
    return res.status(201).json({ success: true, booking: unifiedBooking });
  } catch (error) {
    console.error("💥 Error during booking:", error);
    return res.status(500).json({ message: "Failed to create booking" });
  }
};








