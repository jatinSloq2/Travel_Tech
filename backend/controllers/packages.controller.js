import Package from "../models/Packages/packagesModel.js";
import Flight from "../models/Flights/flightModel.js";
import UnifiedBooking from "../models/booking.js";
import mongoose from "mongoose";

export const searchPackages = async (req, res) => {
  try {
    const { type, city, from, to, date } = req.query;
    let query = {};

    // 🎯 Filter based on package type
    if (type === "single") {
      if (!city) {
        return res.status(400).json({ error: "City is required for single-city package search." });
      }
      query.type = "single";
      query["citiesCovered.cityName"] = city;
    }

    if (type === "multi") {
      if (!from || !to) {
        return res.status(400).json({ error: "Both 'from' and 'to' cities are required for multi-city package search." });
      }
      query.type = "multi";
      query["citiesCovered.cityName"] = { $all: [from, to] }; // ✅ Rough filter
    }

    // 📅 Handle fixed travel date (ignoring time)
    if (date) {
      const inputDate = new Date(date);
      const nextDate = new Date(inputDate);
      nextDate.setDate(inputDate.getDate() + 1);

      query["departureInfo.fixedDates"] = {
        $elemMatch: {
          $gte: inputDate,
          $lt: nextDate,
        },
      };
    }

    // 📦 Fetch & filter
    const packages = await Package.find(query);

    // Extra in-memory filtering for multi-city to match from → to order
    let filteredPackages = packages;
    if (type === "multi") {
      filteredPackages = packages.filter((pkg) => {
        const cities = pkg.citiesCovered.map(c => c.cityName);
        return cities.length > 1 && cities[0] === from && cities[cities.length - 1] === to;
      });
    }

    res.status(200).json({ count: filteredPackages.length, packages: filteredPackages });
  } catch (error) {
    console.error("❌ Package Search Error:", error);
    res.status(500).json({ error: "Internal server error during package search." });
  }
};


// export const createPackageBooking = async (req, res) => {
//     try {
//         const { packageId, travelers, travelDate, user } = req.body;

//         console.log("📥 Booking request received:", { packageId, travelDate, user });

//         if (!packageId || !Array.isArray(travelers) || travelers.length === 0 || !travelDate || !user) {
//             return res.status(400).json({ message: "Package ID, travel date, user, and travelers are required." });
//         }

//         const travelDateObj = new Date(travelDate);
//         const pkg = await Package.findById(packageId);
//         if (!pkg) return res.status(404).json({ message: "Package not found." });

//         const amount = pkg.pricePerPerson * travelers.length;
//         const seats = [];

//         for (const transport of pkg.transports) {
//             const { mode, refId, classOrSeat, fromCity, toCity } = transport;
//             console.log(`✈️ Checking transport: ${mode} | Class: ${classOrSeat}`);

//             if (mode.toLowerCase() === "flight") {
//                 const flight = await Flight.findById(refId);
//                 if (!flight) {
//                     return res.status(404).json({ message: `Flight not found from ${fromCity} → ${toCity}` });
//                 }

//                 // Find the seat type (Economy, Business, etc.)
//                 const normalizedClass = classOrSeat.charAt(0).toUpperCase() + classOrSeat.slice(1).toLowerCase();
//                 const seatType = flight.seatTypes.find((s) => s.type === normalizedClass);
//                 if (!seatType) {
//                     return res.status(400).json({ message: `Class '${classOrSeat}' not found for flight ${flight.flightNumber}` });
//                 }

//                 const allSeats = seatType.seats.map((s) => s.seatNo);

//                 // Find already booked seats for this flight+class+date from UnifiedBooking
//                 const bookings = await UnifiedBooking.find({
//                     bookingType: "package",
//                     travelDate: travelDateObj,
//                     "details.seats": {
//                         $elemMatch: {
//                             mode: "flight",
//                             refId,
//                             classOrSeat,
//                             date: travelDateObj,
//                         },
//                     },
//                 });

//                 const bookedSeatSet = new Set();
//                 bookings.forEach((b) => {
//                     b.details.seats.forEach((s) => {
//                         if (s.mode === "flight" && s.refId.toString() === refId.toString() && s.classOrSeat === classOrSeat) {
//                             s.seats.forEach((seatNo) => bookedSeatSet.add(seatNo));
//                         }
//                     });
//                 });

//                 const availableSeats = allSeats.filter((seatNo) => !bookedSeatSet.has(seatNo));
//                 console.log("🟢 Available seats:", availableSeats);

//                 if (availableSeats.length < travelers.length) {
//                     return res.status(400).json({
//                         message: `Not enough available ${classOrSeat} seats on flight from ${fromCity} to ${toCity}`,
//                     });
//                 }

//                 const assigned = availableSeats.slice(0, travelers.length);

//                 seats.push({
//                     mode,
//                     fromCity,
//                     toCity,
//                     refId,
//                     classOrSeat: normalizedClass,
//                     date: travelDateObj, // ✅ This is what was missing
//                     seats: assigned,
//                 });
//             } else {
//                 // Basic seat generation for bus/train
//                 seats.push({
//                     mode,
//                     fromCity,
//                     toCity,
//                     refId,
//                     classOrSeat,
//                     seats: travelers.map((_, i) => `TEMP-${mode}-${i + 1}`),
//                 });
//             }
//         }

//         // Room assignment from package
//         const roomBooking = pkg.citiesCovered.flatMap((city) =>
//             city.hotels.map((hotelInfo) => ({
//                 cityName: city.cityName,
//                 hotel: hotelInfo.hotel,
//                 roomId: hotelInfo.roomId,
//             }))
//         );

//         // Create the unified booking
//         const booking = await UnifiedBooking.create({
//             user,
//             bookingType: "package",
//             bookingDate: new Date(),
//             travelDate: travelDateObj,
//             amount,
//             paymentStatus: "pending",
//             details: {
//                 packageId,
//                 packageName: pkg.name,
//                 travelers,
//                 seats,
//                 rooms: roomBooking,
//                 duration: pkg.duration,
//                 citiesCovered: pkg.citiesCovered.map((c) => c.cityName),
//             },
//         });

//         console.log("✅ Booking success:", booking._id);

//         res.status(201).json({
//             message: "Package booking created successfully.",
//             bookingId: booking._id,
//             booking,
//         });
//     } catch (err) {
//         console.error("❌ Booking error:", err);
//         res.status(500).json({ message: "Booking creation failed.", error: err.message });
//     }
// };

// export const createPackageBooking = async (req, res) => {
//   try {
//     const { packageId, travelers, travelDate, user } = req.body;
//     console.log("📥 Incoming booking request:", { packageId, travelDate, user, travelers });

//     if (!packageId || !Array.isArray(travelers) || travelers.length === 0 || !travelDate || !user) {
//       console.warn("⚠️ Missing required fields");
//       return res.status(400).json({ message: "Missing required fields." });
//     }

//     const pkg = await Package.findById(packageId);
//     if (!pkg) {
//       console.warn("⚠️ Package not found for ID:", packageId);
//       return res.status(404).json({ message: "Package not found." });
//     }
//     console.log("✅ Package found:", pkg.name);

//     if (pkg.departureInfo.type === "fixed") {
//       const isValidDate = pkg.departureInfo.fixedDates.some(
//         d => new Date(d).toISOString().slice(0, 10) === new Date(travelDate).toISOString().slice(0, 10)
//       );
//       if (!isValidDate) {
//         console.warn("⚠️ Invalid fixed travel date:", travelDate);
//         return res.status(400).json({ message: "Invalid travel date selected." });
//       }
//     }

//     const checkInDate = new Date(travelDate);
//     const nights = parseInt(pkg.duration.split(" ")[0]);
//     const checkOutDate = new Date(checkInDate);
//     checkOutDate.setDate(checkInDate.getDate() + nights);

//     console.log("🛎 Stay duration:", nights, "nights → Check-in:", checkInDate, "Check-out:", checkOutDate);

//     const assignedTransports = [];

//     for (let transport of pkg.transports) {
//       console.log(`🚍 Processing transport: ${transport.mode} | ${transport.fromCity} → ${transport.toCity} | Class: ${transport.classOrSeat}`);

//       const seatAssignments = [];

//       let TransportModel;
//       if (transport.mode === "Flight") TransportModel = Flight;
//       else if (transport.mode === "Bus") TransportModel = Bus;
//       else if (transport.mode === "Train") TransportModel = Train;
//       else continue;

//       const transData = await TransportModel.findById(transport.refId);
//       if (!transData) {
//         console.warn("⚠️ No transport data found for:", transport.refId);
//         continue;
//       }

//       const bookedSeats = new Set();

//       // 🔴 Flight-specific booking overlap check
//       if (transport.mode === "Flight") {
//         const flightBookings = await UnifiedBooking.find({
//           bookingType: "flight",
//           "details.travelers.flight": transport.refId,
//           "details.travelers.date": new Date(travelDate),
//           "details.travelers.seatType": new RegExp(`^${transport.classOrSeat}$`, 'i')
//         });

//         console.log("✈️ Existing flight bookings found:", flightBookings.length);

//         for (const booking of flightBookings) {
//           for (const traveler of booking.details.travelers || []) {
//             if (
//               traveler.flight.toString() === transport.refId.toString() &&
//               new Date(traveler.date).toISOString().slice(0, 10) === new Date(travelDate).toISOString().slice(0, 10) &&
//               traveler.seatType.toLowerCase() === transport.classOrSeat.toLowerCase()
//             ) {
//               bookedSeats.add(traveler.seatNo);
//             }
//           }
//         }
//       }

//       // 🔵 Check existing package bookings
//       const packageBookings = await UnifiedBooking.find({
//         bookingType: "package",
//         travelDate: new Date(travelDate),
//         "details.transports.refId": transport.refId
//       });

//       console.log("📦 Existing package bookings found:", packageBookings.length);

//       for (const b of packageBookings) {
//         const matchedTransport = b.details.transports.find(t => t.refId.toString() === transport.refId.toString());
//         if (matchedTransport && Array.isArray(matchedTransport.seatAssignments)) {
//           matchedTransport.seatAssignments.forEach(sa => bookedSeats.add(sa.seatNumber));
//         }
//       }

//       let selectedSeatType = transData.seatTypes.find(
//   st => st.type.toLowerCase() === transport.classOrSeat.toLowerCase()
// );

// if (!selectedSeatType || !Array.isArray(selectedSeatType.seats)) {
//   console.warn("⚠️ Seat type not found or has no seats:", transport.classOrSeat);
//   return res.status(400).json({
//     message: `Seat type "${transport.classOrSeat}" not available for flight from ${transport.fromCity} to ${transport.toCity}`
//   });
// }

// const availableSeats = selectedSeatType.seats.filter(
//   s => !bookedSeats.has(s.seatNo)
// );

//       console.log("🪑 Available seats found:", availableSeats?.length, "/", transData.seats?.length);

//       if (!availableSeats || availableSeats.length < travelers.length) {
//         console.warn("🚫 Not enough seats:", {
//           needed: travelers.length,
//           available: availableSeats?.length || 0
//         });
//         return res.status(400).json({
//           message: `Not enough seats for ${transport.mode} from ${transport.fromCity} to ${transport.toCity}`
//         });
//       }

//       for (let i = 0; i < travelers.length; i++) {
//         const randomIndex = Math.floor(Math.random() * availableSeats.length);
//         const seat = availableSeats.splice(randomIndex, 1)[0];
//         seatAssignments.push({
//           traveler: travelers[i].fullName,
//           seatNumber: seat.seatNo
//         });
//       }

// assignedTransports.push({
//   mode: transport.mode,
//   fromCity: transport.fromCity,
//   toCity: transport.toCity,
//   refId: transport.refId,
//   classOrSeat: transport.classOrSeat,
//   seatAssignments
// });

// //       seatAssignments.push({
// //   traveler: travelers[i].fullName,
// //   seatNumber: seat.seatNo
// // });
// console.log("🎯 Seat type selected:", transport.classOrSeat);
// console.log("🪑 Total available seats:", availableSeats.length);
//       console.log("✅ Seat assignments for this transport:", seatAssignments);
//     }

//     const amount = travelers.length * pkg.pricePerPerson;
//     console.log("💰 Total amount calculated:", amount);

//     const booking = await UnifiedBooking.create({
//       user,
//       bookingType: "package",
//       travelDate: new Date(travelDate),
//       amount,
//       details: {
//         packageId,
//         packageName: pkg.name,
//         travelers,
//         checkInDate,
//         checkOutDate,
//         hotels: pkg.citiesCovered.flatMap(city => city.hotels),
//         activities: pkg.citiesCovered.flatMap(city => city.activities),
//         transports: assignedTransports
//       }
//     });

//     console.log("✅ Booking successfully created:", booking._id);

//     res.status(201).json({
//       message: "Package booking created successfully.",
//       bookingId: booking._id,
//       booking
//     });

//   } catch (error) {
//     console.error("❌ Booking Error:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };


export const createPackageBooking = async (req, res) => {
  try {
    const { packageId, travelers, travelDate, user } = req.body;

    console.log("📥 Incoming booking request:", { packageId, travelDate, user, travelers });

    if (!packageId || !Array.isArray(travelers) || travelers.length === 0 || !travelDate || !user) {
      return res.status(400).json({ message: "Missing required booking fields." });
    }

    const selectedPackage = await Package.findById(packageId).lean();
    if (!selectedPackage) {
      return res.status(404).json({ message: "Package not found." });
    }

    // 🔢 Calculate total amount
    const totalAmount = selectedPackage.pricePerPerson * travelers.length;

    // 📅 Compute check-in/check-out for each city
    const baseDate = new Date(travelDate);
    let datePointer = new Date(baseDate);
    const citiesWithDates = selectedPackage.citiesCovered.map((city) => {
      const checkIn = new Date(datePointer);
      datePointer.setDate(datePointer.getDate() + (city.stayNights || 1));
      const checkOut = new Date(datePointer);
      return {
        ...city,
        checkIn,
        checkOut,
      };
    });

    const transports = selectedPackage.transports;
    const transportDetails = [];
    const flightTravelerDetails = [];
    const flightRefs = [];

    for (const transport of transports) {
      const {
        fromCity,
        toCity,
        mode,
        refId,
        classOrSeat,
        departureDate,
        departureTime,
        arrivalTime,
      } = transport;

      transportDetails.push({
        fromCity,
        toCity,
        mode,
        refId,
        classOrSeat,
        departureDate,
        departureTime,
        arrivalTime,
      });

      if (mode === "Flight") {
        const flight = await Flight.findById(refId).lean();
        if (!flight) continue;

        const seatType = flight.seatTypes.find((s) => s.type === classOrSeat);
        if (!seatType) {
          return res.status(400).json({
            message: `Seat type '${classOrSeat}' not found in flight ${flight.flightNumber}`,
          });
        }

        // Get already booked seats for this flight/date/class
        const existingBookings = await UnifiedBooking.find({
          "details.flights.flight": refId,
          "details.flights.date": new Date(departureDate),
          "details.flights.seatType": classOrSeat,
        });

        const bookedSeats = new Set();
        for (const booking of existingBookings) {
          for (const t of booking.details.travelers || []) {
            if (t.flight?.toString() === refId.toString() && t.seatType === classOrSeat && t.date.toISOString().slice(0, 10) === new Date(departureDate).toISOString().slice(0, 10)) {
              bookedSeats.add(t.seatNo);
            }
          }
        }

        const availableSeats = seatType.seats.map((s) => s.seatNo).filter((s) => !bookedSeats.has(s));

        if (availableSeats.length < travelers.length) {
          return res.status(400).json({
            message: `Not enough seats available in ${classOrSeat} class for flight ${flight.flightNumber}`,
          });
        }

        for (let i = 0; i < travelers.length; i++) {
          const seatNo = availableSeats[i];
          travelers[i].seatNo = seatNo;
          travelers[i].flight = refId;
          travelers[i].date = new Date(departureDate);
          travelers[i].seatType = classOrSeat;

          flightTravelerDetails.push({
            flight: refId,
            date: new Date(departureDate),
            seatType: classOrSeat,
            seatNo,
          });
        }

        flightRefs.push({
          flight: refId,
          date: new Date(departureDate),
          seatType: classOrSeat,
        });
      }
    }

    const booking = new UnifiedBooking({
      user,
      bookingType: "package",
      travelDate: new Date(travelDate),
      amount: totalAmount,
      paymentStatus: "pending",
      details: {
        packageId,
        packageName: selectedPackage.name,
        travelers,
        citiesCovered: citiesWithDates,
        transports: transportDetails,
        duration: selectedPackage.duration,
        pricePerPerson: selectedPackage.pricePerPerson,
        departureInfo: selectedPackage.departureInfo,
        flights: flightRefs,
        email: travelers[0]?.email || "",
      },
    });

    await booking.save();

    res.status(201).json({
      message: "✅ Package booking created successfully.",
      bookingId: booking._id,
      booking,
    });
  } catch (error) {
    console.error("❌ Package Booking Error:", error);
    res.status(500).json({ message: "Internal server error while booking package." });
  }
};



