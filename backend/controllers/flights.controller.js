import mongoose from "mongoose";
import UnifiedBooking from "../models/booking.js";
import Airport from "../models/Flights/airportModel.js";
import Flight from "../models/Flights/flightModel.js";
import FlightBookingReview from "../models/Flights/flightReviewModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getAllAirport = async (req, res) => {
  try {
    const airports = await Airport.find();
    res.json({ success: true, airports });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch airports", error: error.message });
  }
};

export const getFlightsByFilter = async (req, res) => {
  const { from, to, departureDate, maxStops = 1, seatClass, maxPrice } = req.query;
  if (!from || !to || !departureDate) return res.status(400).json({ success: false, message: "Fields 'from', 'to', and 'departureDate' are required.", });
  try {
    const fromAirports = await Airport.find({ code: from });
    const toAirports = await Airport.find({ code: to });
    if (!fromAirports.length || !toAirports.length) return res.status(404).json({ success: false, message: "City not found" });
    const fromAirportIds = fromAirports.map(a => a._id.toString());
    const toAirportIdsSet = new Set(toAirports.map(a => a._id.toString()));
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dateObj = new Date(departureDate);
    const departureDay = days[dateObj.getUTCDay()];
    const allFlights = await Flight.find({ operatingDays: { $in: [departureDay] }, }).populate("fromAirport toAirport");
    const timeToMinutes = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const flightsMap = new Map();
    for (const flight of allFlights) {
      const fromId = flight.fromAirport._id.toString();
      if (!flightsMap.has(fromId)) flightsMap.set(fromId, []);
      flightsMap.get(fromId).push(flight);
    }
    const results = [];
    const filterSeatTypes = (seatTypes) => {
      return seatTypes.filter(seat => {
        if (seatClass && seat.type !== seatClass) return false;
        if (maxPrice && seat.price > Number(maxPrice)) return false;
        return true;
      });
    };

    const findPaths = (path, currentAirportId, visited) => {
      if (toAirportIdsSet.has(currentAirportId)) {
        const allLegsHaveSeats = path.every(flight => {
          const filteredSeats = filterSeatTypes(flight.seatTypes);
          return filteredSeats.length > 0;
        });
        if (allLegsHaveSeats) results.push([...path]); return;
      }
      if (path.length > maxStops) return;
      const lastFlight = path[path.length - 1];
      const arrivalTimeMinutes = timeToMinutes(lastFlight.arrivalTime);
      const nextFlights = flightsMap.get(currentAirportId) || [];
      for (const nextFlight of nextFlights) {
        const nextToId = nextFlight.toAirport._id.toString();
        if (visited.has(nextToId)) continue;
        const filteredSeats = filterSeatTypes(nextFlight.seatTypes);
        if (filteredSeats.length === 0) continue;
        if (timeToMinutes(nextFlight.departureTime) > arrivalTimeMinutes) {
          visited.add(nextToId);
          findPaths([...path, nextFlight], nextToId, visited);
          visited.delete(nextToId);
        }
      }
    };

    for (const startAirportId of fromAirportIds) {
      const startingFlights = flightsMap.get(startAirportId) || [];
      for (const flight of startingFlights) {
        const filteredSeats = filterSeatTypes(flight.seatTypes);
        if (filteredSeats.length === 0) continue;
        const visited = new Set([startAirportId, flight.toAirport._id.toString()]);
        findPaths([flight], flight.toAirport._id.toString(), visited);
      }
    }
    const formattedResults = results.map(path => ({
      isConnecting: path.length > 1,
      legs: path.map(flight => {
        const filteredSeatTypes = filterSeatTypes(flight.seatTypes).map(({ type, price }) => ({ type, price }));
        return {
          _id: flight._id,
          flightNumber: flight.flightNumber,
          airline: flight.airline,
          fromAirport: flight.fromAirport,
          toAirport: flight.toAirport,
          departureTime: flight.departureTime,
          arrivalTime: flight.arrivalTime,
          operatingDays: flight.operatingDays,
          seatTypes: filteredSeatTypes,
        };
      }),
    }));
    return res.json({ success: true, flights: formattedResults });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch flights", error: error.message, });
  }
};

export const getFlightById = async (req, res) => {
  let { flightIds, date } = req.query;
  if (!date) return res.status(400).json({ message: 'Date is required in YYYY-MM-DD format' });
  if (!flightIds) return res.status(400).json({ message: 'flightIds query parameter is required' });
  const flightIdArray = flightIds.split(',').map(id => id.trim()).filter(id => mongoose.Types.ObjectId.isValid(id));
  if (flightIdArray.length === 0) return res.status(400).json({ message: 'flightIds must contain valid ObjectIds' });
  const queryDate = new Date(date);
  const queryDateISO = queryDate.toISOString().split('T')[0];
  try {
    const result = [];
    for (const flightId of flightIdArray) {
      const flight = await Flight.findById(flightId)
        .populate('fromAirport', 'code name city')
        .populate('toAirport', 'code name city')
        .lean();

      if (!flight) return res.status(404).json({ message: `Flight ${flightId} not found` });
      const unifiedBookings = await UnifiedBooking.find({
        bookingType: 'flight',
        'details.travelers.flight': flightId,
        'details.travelers.date': queryDate,
        status: 'confirmed',
      }).lean();
      const bookedSeats = [];
      unifiedBookings.forEach(booking => {
        booking.details.travelers.forEach(traveler => {
          if (
            traveler.flight.toString() === flightId &&
            traveler.date.toISOString().split('T')[0] === queryDateISO
          ) {
            bookedSeats.push({
              seatNo: traveler.seatNo,
              seatType: traveler.seatType.toLowerCase()
            });
          }
        });
      });
      const startOfDay = new Date(queryDateISO);
      const endOfDay = new Date(new Date(queryDateISO).getTime() + 24 * 60 * 60 * 1000);
      const packageBookings = await UnifiedBooking.find({
        bookingType: 'package',
        status: { $in: 'confirmed' },
        $or: [
          {
            'details.travelers': {
              $elemMatch: {
                flight: new mongoose.Types.ObjectId(flightId),
                date: { queryDateISO }
              }
            }
          },
          {
            'details.transports': {
              $elemMatch: {
                mode: 'Flight',
                refId: new mongoose.Types.ObjectId(flightId),
                departureDate: { $gte: startOfDay, $lt: endOfDay }
              }
            }
          },
          {
            'details.flights': {
              $elemMatch: {
                flight: new mongoose.Types.ObjectId(flightId),
                date: { $gte: startOfDay, $lt: endOfDay }
              }
            }
          }
        ]
      }).lean();
      const packageClassCount = {};
      packageBookings.forEach(pkg => {
        const cls = pkg.travelClass?.toLowerCase();
        if (!cls) return;
        if (!packageClassCount[cls]) packageClassCount[cls] = 0;
        packageClassCount[cls] += pkg.travelers?.length || 0;
      });
      const seatTypes = flight.seatTypes.map(seatType => {
        const seatClass = seatType.type.toLowerCase();
        const allSeats = seatType.seats.map(seat => seat.seatNo);
        const unifiedBookedCount = bookedSeats.filter(bs => bs.seatType === seatClass).length;
        const packageBookedCount = packageClassCount[seatClass] || 0;
        const totalBooked = unifiedBookedCount + packageBookedCount;
        const availableCount = Math.max(0, allSeats.length - totalBooked);
        return {
          type: seatType.type,
          price: seatType.price,
          availableCount,
        };
      });
      result.push({
        flightId: flight._id.toString(),
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        from: flight.fromAirport,
        to: flight.toAirport,
        date,
        operatingDays: flight.operatingDays,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        duration: flight.duration,
        seatTypes,
      });
    }
    res.status(200).json({ success: true, totalLegs: result.length, flights: result, });
  } catch (err) {
    console.error('Error fetching flights:', err);
    res.status(500).json({ message: 'Failed to fetch flight details' });
  }
};

const assignRandomSeat = (allSeats, bookedSeatsSet) => {
  const availableSeats = allSeats.filter(seatNo => !bookedSeatsSet.has(seatNo));
  if (availableSeats.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * availableSeats.length);
  return availableSeats[randomIndex];
};



export const flightBooking = async (req, res) => {
  const userId = req.user.id;
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ message: "Missing session_id" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const metadata = session.metadata;

    if (!metadata) {
      return res.status(400).json({ message: "No metadata found in session" });
    }

    const bookingDetails = JSON.parse(metadata.bookingDetails || "{}");

    const travelers = bookingDetails.travelers || [];
    const email = bookingDetails.email || "";
    const flights = bookingDetails.flights || [];

    if (!Array.isArray(travelers) || !travelers.length || !email.trim() || !Array.isArray(flights) || !flights.length) {
      return res.status(400).json({ message: "Incomplete booking metadata" });
    }

    const flightIds = flights.map((f) => f.flight);
    const flightDocs = await Flight.find({ _id: { $in: flightIds } }).lean();

    const flightMap = new Map();
    for (const flight of flightDocs) {
      flightMap.set(flight._id.toString(), flight);
    }

    const bookedSeatsMap = new Map();

    for (const flightSegment of flights) {
      const { flight: flightId, date, seatType } = flightSegment;
      const dateISO = new Date(date).toISOString().split("T")[0];
      const key = `${flightId}_${dateISO}_${seatType}`;

      const bookings = await UnifiedBooking.find({
        bookingType: { $in: ["flight", "package"] },
        travelDate: new Date(date),
        status: "confirmed",
        $or: [
          {
            bookingType: "flight",
            "details.travelers.flight": flightId,
            "details.travelers.seatType": seatType,
          },
          {
            bookingType: "package",
            "details.seats": {
              $elemMatch: {
                mode: "Flight",
                refId: flightId,
                classOrSeat: seatType,
              },
            },
          },
        ],
      }).lean();

      const bookedSeats = new Set();
      bookings.forEach((booking) => {
        if (booking.bookingType === "flight") {
          booking.details.travelers.forEach((t) => {
            if (
              t.flight.toString() === flightId &&
              t.date.toISOString().split("T")[0] === dateISO &&
              t.seatType === seatType
            ) {
              bookedSeats.add(t.seatNo);
            }
          });
        } else if (booking.bookingType === "package") {
          booking.details.seats.forEach((seatGroup) => {
            if (
              seatGroup.mode === "Flight" &&
              seatGroup.refId.toString() === flightId &&
              seatGroup.classOrSeat === seatType
            ) {
              seatGroup.seats.forEach((seatNo) => bookedSeats.add(seatNo));
            }
          });
        }
      });

      bookedSeatsMap.set(key, bookedSeats);
    }

    // Assign seats
    const finalTravelers = [];
    let amount = 0;

    for (const traveler of travelers) {
      for (const flightSegment of flights) {
        const { flight: flightId, date, seatType } = flightSegment;
        const flight = flightMap.get(flightId);

        if (!flight) {
          return res.status(404).json({ message: `Flight ${flightId} not found` });
        }

        const seatTypeData = flight.seatTypes.find((st) => st.type === seatType);
        if (!seatTypeData) {
          return res.status(400).json({
            message: `Seat type ${seatType} not found on flight ${flightId}`,
          });
        }

        const allSeats = seatTypeData.seats.map((s) => s.seatNo);
        const dateISO = new Date(date).toISOString().split("T")[0];
        const key = `${flightId}_${dateISO}_${seatType}`;
        let bookedSet = bookedSeatsMap.get(key);

        if (!bookedSet) {
          bookedSet = new Set();
          bookedSeatsMap.set(key, bookedSet);
        }

        const seatNo = assignRandomSeat(allSeats, bookedSet);
        if (!seatNo) {
          return res.status(409).json({
            message: `No available seats for ${seatType} on flight ${flightId} for ${date}`,
          });
        }

        bookedSet.add(seatNo);

        finalTravelers.push({
          name: traveler.name,
          phone: traveler.phone,
          flight: flightId,
          date: new Date(date),
          seatType,
          seatNo,
        });

        amount += seatTypeData.price || 0;
      }
    }

    const booking = new UnifiedBooking({
      user: userId,
      bookingType: "flight",
      bookingDate: new Date(),
      travelDate: new Date(flights[0].date),
      status: "confirmed",
      paymentStatus: "paid",
      amount,
      details: {
        travelers: finalTravelers,
        email,
        flights: flights.map((f) => ({
          flight: f.flight,
          date: f.date,
          seatType: f.seatType,
        })),
      },
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Flight booking confirmed",
      bookingId: booking._id,
      amount,
      travelers: finalTravelers,
    });
  } catch (error) {
    console.error("❌ Error during Stripe flight booking:", error);
    res.status(500).json({ message: "Failed to confirm Stripe flight booking" });
  }
};

// export const flightBooking = async (req, res) => {
//   const userId = req.user.id;
//   const { travelers, email, flights } = req.body;
//   if (!travelers || !Array.isArray(travelers) || travelers.length === 0) return res.status(400).json({ message: 'Travelers info is required' });
//   if (!email || !email.trim()) return res.status(400).json({ message: 'Contact email is required' });
//   if (!flights || !Array.isArray(flights) || flights.length === 0) return res.status(400).json({ message: 'Flights info is required' });
//   try {
//     const flightIds = flights.map(f => f.flight);
//     const flightDocs = await Flight.find({ _id: { $in: flightIds } }).lean();
//     let amount = 0;
//     const flightMap = new Map();
//     for (const flight of flightDocs) {
//       flightMap.set(flight._id.toString(), flight);
//     }
//     const bookedSeatsMap = new Map();
//     for (const flightSegment of flights) {
//       const { flight: flightId, date, seatType } = flightSegment;
//       const dateISO = new Date(date).toISOString().split('T')[0];
//       const key = `${flightId}_${dateISO}_${seatType}`;
//       const bookings = await UnifiedBooking.find({
//         bookingType: { $in: ["flight", "package"] },
//         travelDate: new Date(date),
//         status: 'confirmed',
//         $or: [
//           {
//             bookingType: "flight",
//             'details.travelers.flight': flightId,
//             'details.travelers.seatType': seatType,
//           },
//           {
//             bookingType: "package",
//             'details.seats': {
//               $elemMatch: {
//                 mode: "Flight",
//                 refId: flightId,
//                 classOrSeat: seatType,
//               }
//             }
//           }
//         ]
//       }).lean();

//       const bookedSeats = new Set();
//       bookings.forEach(booking => {
//         if (booking.bookingType === "flight") {
//           booking.details.travelers.forEach(traveler => {
//             if (
//               traveler.flight.toString() === flightId &&
//               traveler.date.toISOString().split('T')[0] === dateISO &&
//               traveler.seatType === seatType
//             ) {
//               bookedSeats.add(traveler.seatNo);
//             }
//           });
//         } else if (booking.bookingType === "package") {
//           booking.details.seats.forEach(seatGroup => {
//             if (
//               seatGroup.mode === "Flight" &&
//               seatGroup.refId.toString() === flightId &&
//               seatGroup.classOrSeat === seatType
//             ) {
//               seatGroup.seats.forEach(seatNo => bookedSeats.add(seatNo));
//             }
//           });
//         }
//       });

//       bookedSeatsMap.set(key, bookedSeats);
//     }

//     // Assign seats
//     const finalTravelers = [];

//     for (const traveler of travelers) {
//       for (const flightSegment of flights) {
//         const { flight: flightId, date, seatType } = flightSegment;
//         const flight = flightMap.get(flightId);
//         if (!flight) {
//           return res.status(404).json({ message: `Flight ${flightId} not found` });
//         }

//         const seatTypeData = flight.seatTypes.find(st => st.type === seatType);
//         if (!seatTypeData) {
//           return res.status(400).json({ message: `Seat type ${seatType} not found on flight ${flightId}` });
//         }

//         const allSeats = seatTypeData.seats.map(s => s.seatNo);
//         const dateISO = new Date(date).toISOString().split('T')[0];
//         const key = `${flightId}_${dateISO}_${seatType}`;
//         let bookedSeatsSet = bookedSeatsMap.get(key);
//         if (!bookedSeatsSet) {
//           bookedSeatsSet = new Set();
//           bookedSeatsMap.set(key, bookedSeatsSet);
//         }

//         const seatNo = assignRandomSeat(allSeats, bookedSeatsSet);
//         if (!seatNo) {
//           return res.status(409).json({
//             message: `No available seats for ${seatType} on flight ${flightId} for date ${date}`,
//           });
//         }

//         bookedSeatsSet.add(seatNo);

//         finalTravelers.push({
//           name: traveler.name,
//           phone: traveler.phone,
//           flight: flightId,
//           date: new Date(date),
//           seatType,
//           seatNo,
//         });

//         amount += seatTypeData.price || 0;
//       }
//     }

//     // Create unified booking
//     const booking = new UnifiedBooking({
//       user: userId,
//       bookingType: "flight",
//       bookingDate: new Date(),
//       travelDate: new Date(flights[0].date),
//       status: "confirmed",
//       amount,
//       paymentStatus: "pending",
//       details: {
//         travelers: finalTravelers,
//         email,
//         flights: flights.map(f => ({
//           flight: f.flight,
//           date: f.date,
//           seatType: f.seatType,
//         }))
//       }
//     });

//     await booking.save();

//     res.status(201).json({
//       success: true,
//       message: 'Booking confirmed',
//       bookingId: booking._id,
//       travelers: finalTravelers,
//       amount,
//     });
//   } catch (error) {
//     console.error('Booking error:', error);
//     res.status(500).json({ message: 'Failed to confirm booking' });
//   }
// };













export const addFlightReview = async (req, res) => {
  const userId = req.user.id;
  const { bookingId, flightId, ratingNo, comment } = req.body;
  if (!bookingId || !flightId || !ratingNo) {
    return res.status(400).json({ message: 'bookingId, flightId, and ratingNo are required' });
  }
  if (ratingNo < 1 || ratingNo > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const booking = await FlightBooking.findOne({ _id: bookingId, user: userId }).lean();
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found for this user' });
    }

    if (booking.status !== 'Completed') {
      return res.status(400).json({ message: 'Review can only be added for completed bookings' });
    }
    const existingReview = await FlightBookingReview.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(409).json({ message: 'Review already exists for this booking' });
    }
    const newReview = new FlightBookingReview({
      flight: flightId,
      booking: bookingId,
      user: userId,
      rating: ratingNo,
      comment: comment?.trim() || '',
    });

    await newReview.save();

    res.status(201).json({ success: true, message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Failed to add review for booking' });
  }
};
export const deleteUserBooking = async (req, res) => {
  console.log('route hit')
  const userId = req.user.id;
  const bookingId = req.params.id;

  try {
    const booking = await FlightBooking.findById(bookingId);
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found." });

    if (booking.user !== userId)
      return res.status(403).json({ success: false, message: "Unauthorized." });

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: "Booking is already cancelled." });
    }

    res.status(200).json({ success: true, message: "Booking cancelled successfully." });

    booking.status = 'Cancelled';
    await booking.save();
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Failed to cancel the booking' });
  }
}















