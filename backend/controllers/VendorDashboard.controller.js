import Room from "../models/Hotel/roomModel.js"
import Review from '../models/Hotel/reviewModel.js';
import Hotel from '../models/Hotel/hotelModel.js';
//----------------------------------------------------------------
import Bus from "../models/Bus/busModel.js"
import Route from "../models/Bus/busRouteModel.js"
import Seat from "../models/Bus/busSeatModel.js"
import BusBooking from "../models/Bus/busBookingModel.js";
import BusReview from "../models/Bus/busReviewModel.js"
//----------------------------------------------------------------
import UnifiedBooking from "../models/booking.js"

import { getDateRange } from "../utils/getDateRange.js";
import mongoose from "mongoose";


export const getVendorHotels = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let hotels;
    if (userRole === 'ADMIN') {
      hotels = await Hotel.find().select('id name location createdAt');
    } else {
      hotels = await Hotel.find({ owner: userId }).select('id name location createdAt');
    }

    res.json(hotels);
  } catch (error) {
    console.error('Error fetching vendor hotels:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
export const vendorAnalyticsBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { hotelId, range, startDate, endDate } = req.query;

    console.log("📥 Query Params:", { hotelId, range, startDate, endDate });
    console.log("👤 User Info:", { userId, userRole });

    if (!userRole || !range) {
      return res.status(400).json({ message: "Role and range are required" });
    }

    // 🔍 Hotel Filter
    let hotelFilter = {};
    if (userRole !== "ADMIN") {
      hotelFilter.owner = userId;
    }

    if (hotelId) {
      if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        return res.status(400).json({ message: "Invalid hotelId" });
      }
      hotelFilter._id = new mongoose.Types.ObjectId(hotelId);
    }

    const hotels = await Hotel.find(hotelFilter).select("_id");
    if (!hotels.length) {
      console.log("⚠️ No hotels found.");
      return res.json([]);
    }

    const hotelIdStrings = hotels.map((h) => h._id.toString());
    console.log("🏨 Hotel IDs (strings):", hotelIdStrings);

    // 📆 Date Range Filter
    let createdAtFilter = {};
    if (range !== "custom") {
      createdAtFilter = getDateRange(range);
    } else {
      if (startDate && endDate) {
        createdAtFilter = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else {
        return res.status(400).json({ message: "StartDate and EndDate required for custom range" });
      }
    }

    console.log("📆 Date Range Filter:", createdAtFilter);

    // 📊 Aggregation Pipeline
    const pipeline = [
      {
        $match: {
          bookingType: "hotel",
          ...(Object.keys(createdAtFilter).length ? { bookingDate: createdAtFilter } : {}),
          status: { $in: ["booked", "completed", "confirmed"] },
        },
      },
      {
        $match: {
          "details.hotel": { $in: hotelIdStrings }, // ✅ Match with strings
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" } },
          bookings: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          bookings: 1,
          revenue: 1,
        },
      },
      { $sort: { date: 1 } },
    ];

    console.log("🔍 Aggregation Pipeline:", JSON.stringify(pipeline, null, 2));

    const result = await UnifiedBooking.aggregate(pipeline);
    console.log("✅ Aggregation Result:", result);

    res.json(result);
  } catch (err) {
    console.error("❌ Error in unified booking analytics:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const upcomingBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const vendorId = req.query?.vendorId;
    const { hotelId } = req.query;

    console.log("🔐 Role Info:", { userId, userRole, vendorId });

    let ownerId = userRole === 'ADMIN' ? vendorId || null : userId;

    const today = new Date();
    let hotelFilter = {};
    if (ownerId) hotelFilter.owner = ownerId;

    const hotels = await Hotel.find(hotelFilter).select("_id name");
    const hotelIdMap = new Map(hotels.map(h => [h._id.toString(), h.name]));
    const hotelIds = Array.from(hotelIdMap.keys());

    if (!hotelIds.length) return res.json([]);

    let filteredHotelIds = [];
    if (hotelId && hotelId !== 'all') {
      if (!hotelIds.includes(hotelId)) {
        return res.status(403).json({ message: "Unauthorized hotel access" });
      }
      filteredHotelIds = [hotelId];
    } else {
      filteredHotelIds = hotelIds;
    }

    const bookings = await UnifiedBooking.find({
      bookingType: "hotel",
      "details.hotel": { $in: filteredHotelIds },
      "details.checkIn": { $gte: today },
      status: { $in: ["booked", "completed", "confirmed"] },
    })
      .sort({ "details.checkIn": 1 })
      .lean();

    const response = bookings.map((b) => {
      const checkIn = new Date(b.details.checkIn);
      const checkOut = new Date(b.details.checkOut);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

      return {
        guestName: b.details.bookedBy || "N/A",
        hotelName: hotelIdMap.get(b.details.hotel) || "Unknown",
        checkIn: checkIn.toISOString().split("T")[0],
        nights,
        roomType: b.details.roomType || "N/A",
        amount: b.amount || 0,
      };
    });

    res.json(response);
  } catch (err) {
    console.error("❌ Error fetching upcoming bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const recentReviews = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { hotelId } = req.query;

    if (!ownerId) {
      return res.status(400).json({ message: "ownerId is required" });
    }
    const ownerHotels = await Hotel.find({ owner: ownerId }).select("_id");
    const ownerHotelIds = ownerHotels.map((h) => h._id.toString());

    if (ownerHotelIds.length === 0) {
      return res.json([]);
    }

    let hotelFilter;

    if (hotelId && hotelId !== "all") {
      if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        return res.status(400).json({ message: "Invalid hotelId" });
      }
      if (!ownerHotelIds.includes(hotelId)) {
        return res.status(403).json({ message: "Unauthorized hotel access" });
      }
      hotelFilter = new mongoose.Types.ObjectId(hotelId);
    } else {
      hotelFilter = { $in: ownerHotelIds.map((id) => new mongoose.Types.ObjectId(id)) };
    }

    const reviews = await Review.aggregate([
      { $match: { hotel: hotelFilter } },
      {
        $lookup: {
          from: "bookings",
          localField: "booking",
          foreignField: "_id",
          as: "bookingInfo",
        },
      },
      { $unwind: "$bookingInfo" },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      {
        $project: {
          user: "$bookingInfo.name",
          rating: 1,
          comment: 1,
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
      },
    ]);

    res.json(reviews);
  } catch (err) {
    console.error("Error in /vendor/reviews/recent:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const inventory = async (req, res) => {
  try {
    const { hotelId, date } = req.query;
    const ownerId = req.user.id;

    if (!ownerId) {
      return res.status(400).json({ message: "ownerId is required" });
    }

    let targetDate = date ? new Date(date) : new Date();
    if (isNaN(targetDate)) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
    }

    targetDate.setHours(0, 0, 0, 0);
    const targetDateStart = new Date(targetDate);
    const targetDateEnd = new Date(targetDate);
    targetDateEnd.setHours(23, 59, 59, 999);

    // Get hotels owned by this vendor
    const ownerHotels = await Hotel.find({ owner: ownerId }).select("_id name");
    const ownerHotelIds = ownerHotels.map(h => h._id.toString());
    if (!ownerHotelIds.length) return res.json([]);

    let hotelFilterIds = [];
    if (hotelId && hotelId !== "all") {
      if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        return res.status(400).json({ message: "Invalid hotelId" });
      }
      if (!ownerHotelIds.includes(hotelId)) {
        return res.status(403).json({ message: "Unauthorized hotel access" });
      }
      hotelFilterIds = [hotelId];
    } else {
      hotelFilterIds = ownerHotelIds;
    }

    const hotelIdToName = {};
    ownerHotels.forEach(hotel => {
      hotelIdToName[hotel._id.toString()] = hotel.name;
    });

    // Fetch room data
    const rooms = await Room.find({ hotel: { $in: hotelFilterIds } }).select("roomType totalRooms hotel");

    // Aggregate bookings from UnifiedBooking on selected date
    const bookingsOnDate = await UnifiedBooking.aggregate([
      {
        $match: {
          bookingType: "hotel",
          "details.hotel": { $in: hotelFilterIds },
          status: { $in: ["booked", "completed", "confirmed"] },
          "details.checkIn": { $lte: targetDateEnd },
          "details.checkOut": { $gt: targetDateStart },
        },
      },
      {
        $group: {
          _id: "$details.room",
          totalBooked: { $sum: "$details.totalRooms" },
        },
      },
    ]);

    const bookedMap = {};
    bookingsOnDate.forEach(b => {
      bookedMap[b._id?.toString()] = b.totalBooked;
    });

    // Format response
    const result = rooms.map(room => {
      const booked = bookedMap[room._id.toString()] || 0;
      return {
        hotelId: room.hotel,
        hotelName: hotelIdToName[room.hotel.toString()] || "Unknown Hotel",
        roomType: room.roomType,
        total: room.totalRooms,
        booked,
        available: Math.max(room.totalRooms - booked, 0),
      };
    });

    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching inventory:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//-----------------------------------------------------------------------------


export const getVendorBuses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const vendorIdQuery = req.query.vendorId;

    let buses;

    if (userRole === 'ADMIN' && !vendorIdQuery) {
      buses = await Bus.find().select('id name busNumber createdAt');
    } else {
      const ownerId = vendorIdQuery || userId;
      buses = await Bus.find({ owner: ownerId }).select('id name busNumber createdAt');
    }

    res.status(200).json(buses);
  } catch (error) {
    console.error('Error fetching vendor buses:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const vendorAnalyticsBookingBus = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { busId, range, startDate, endDate, vendorId } = req.query;

    let ownerIdToUse;

    if (userRole === 'ADMIN' && !vendorId) {
      ownerIdToUse = null;
    } else {
      ownerIdToUse = vendorId || userId;
    }

    if (!range) {
      return res.status(400).json({ message: "Range is required" });
    }

    let ownerBusIds = [];

    if (ownerIdToUse) {
      const ownerBuses = await Bus.find({ owner: ownerIdToUse }).select("_id");
      ownerBusIds = ownerBuses.map(b => b._id.toString());

      if (ownerBusIds.length === 0) {
        return res.json([]); // No buses for vendor
      }
    }

    // Bus filter check
    let busFilterIds = [];

    if (busId && busId !== "all") {
      if (!mongoose.Types.ObjectId.isValid(busId)) {
        return res.status(400).json({ message: "Invalid busId" });
      }

      if (ownerIdToUse && !ownerBusIds.includes(busId)) {
        return res.status(403).json({ message: "Unauthorized bus access" });
      }

      busFilterIds = [busId];
    } else {
      busFilterIds = ownerIdToUse ? ownerBusIds : [];
    }

    // Build match object
    const match = {
      bookingType: "bus",
      status: { $in: ["booked", "completed", "confirmed"] },
    };

    if (busFilterIds.length > 0) {
      match["details.bus"] = { $in: busFilterIds };
    }

    // Date range filtering based on bookingDate
    if (range !== "custom") {
      const dateFilter = getDateRange(range);
      if (dateFilter) {
        match.bookingDate = dateFilter;
      }
    } else {
      if (startDate && endDate) {
        match.bookingDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else {
        return res.status(400).json({ message: "StartDate and EndDate required for custom range" });
      }
    }

    // Aggregation pipeline
    const result = await UnifiedBooking.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" } },
          bookings: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          bookings: 1,
          revenue: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.json(result);
  } catch (err) {
    console.error("❌ Error in bus booking analytics:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const upcomingBookingsBus = async (req, res) => {
  try {
    const { busId } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Determine correct owner
    const ownerId = userRole === 'ADMIN' && req.query.vendorId ? req.query.vendorId : userId;
    if (!ownerId) {
      return res.status(400).json({ message: "ownerId is required" });
    }

    // Fetch owned buses
    const ownerBuses = await Bus.find({ owner: ownerId }).select("_id name busNumber");
    const ownerBusIds = ownerBuses.map(b => b._id.toString());
    if (!ownerBusIds.length) return res.json([]);

    // Validate busId if passed
    let busFilterIds = [];
    if (busId && busId !== "all") {
      if (!mongoose.Types.ObjectId.isValid(busId)) {
        return res.status(400).json({ message: "Invalid busId" });
      }
      if (!ownerBusIds.includes(busId)) {
        return res.status(403).json({ message: "Unauthorized bus access" });
      }
      busFilterIds = [busId];
    } else {
      busFilterIds = ownerBusIds;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await UnifiedBooking.find({
      bookingType: "bus",
      status: { $in: ["booked", "confirmed", "completed"] },
      "details.bus": { $in: busFilterIds },
      "details.journeyDate": { $gte: today },
    })
      .populate("details.bus", "name busNumber")
      .sort({ "details.journeyDate": 1 });

    const response = bookings.map(b => ({
      travellerNames: b.details.travellers?.map(t => t.name) || [],
      journeyDate: b.details.journeyDate?.toISOString().split("T")[0] || "N/A",
      amount: b.amount,
      busName: b.details.bus?.name || "Unknown",
      busNumber: b.details.bus?.busNumber || "N/A",
    }));

    res.json(response);
  } catch (err) {
    console.error("❌ Error fetching upcoming bus bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const recentReviewsBus = async (req, res) => {
  try {
    const { busId } = req.query;
    const ownerId = req.user.id;

    if (!ownerId) {
      return res.status(400).json({ message: "ownerId is required" });
    }

    /* ── 1. Get all buses owned by the vendor ───────────────────────── */
    const ownerBuses = await Bus.find({ owner: ownerId }).select("_id");
    const ownerBusIds = ownerBuses.map((b) => b._id.toString());

    if (ownerBusIds.length === 0) {
      return res.json([]);
    }
    let busFilterIds = [];

    if (busId && busId !== "all") {
      if (!mongoose.Types.ObjectId.isValid(busId)) {
        return res.status(400).json({ message: "Invalid busId" });
      }
      if (!ownerBusIds.includes(busId)) {
        return res.status(403).json({ message: "Unauthorized bus access" });
      }
      busFilterIds = [busId];
    } else {
      busFilterIds = ownerBusIds;
    }

    const reviews = await BusReview.aggregate([
      {
        $match: {
          bus: { $in: busFilterIds.map(id => new mongoose.Types.ObjectId(id)) }
        }
      },
      {
        $lookup: {
          from: "busbookings",
          localField: "booking",
          foreignField: "_id",
          as: "bookingInfo"
        }
      },
      { $unwind: "$bookingInfo" },
      {
        $addFields: {
          travellerNames: {
            $map: {
              input: "$bookingInfo.travellers",
              as: "traveller",
              in: "$$traveller.name"
            }
          }
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      {
        $project: {
          travellerNames: 1,
          rating: 1,
          comment: 1,
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
        }
      }
    ]);
    console.log(reviews)

    res.json(reviews);
  } catch (err) {
    console.error("Error in /vendor/reviews/recent:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const inventoryBus = async (req, res) => {
  try {
    const { busId, date } = req.query;
    const ownerId = req.user.id;

    if (!ownerId) {
      return res.status(400).json({ message: "ownerId is required" });
    }

    let targetDate = date ? new Date(date) : new Date();
    if (isNaN(targetDate)) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
    }

    targetDate.setHours(0, 0, 0, 0);
    const targetDateStart = new Date(targetDate);
    const targetDateEnd = new Date(targetDate);
    targetDateEnd.setHours(23, 59, 59, 999);

    // Find all buses owned by the vendor
    const ownerBuses = await Bus.find({ owner: ownerId }).select("_id totalSeats busNumber name");
    const ownerBusIds = ownerBuses.map(b => b._id.toString());
    if (!ownerBusIds.length) return res.json([]);

    // Validate bus filter
    let busFilterIds = [];
    if (busId && busId !== "all") {
      if (!mongoose.Types.ObjectId.isValid(busId)) {
        return res.status(400).json({ message: "Invalid busId" });
      }
      if (!ownerBusIds.includes(busId)) {
        return res.status(403).json({ message: "Unauthorized bus access" });
      }
      busFilterIds = [busId];
    } else {
      busFilterIds = ownerBusIds;
    }

    // Filter actual bus objects
    const filteredBuses = ownerBuses.filter(b => busFilterIds.includes(b._id.toString()));

    // Aggregate bookings for the day using UnifiedBooking
    const bookings = await UnifiedBooking.aggregate([
      {
        $match: {
          bookingType: "bus",
          status: { $in: ["booked", "confirmed", "completed"] },
          "details.bus": { $in: busFilterIds.map(id => new mongoose.Types.ObjectId(id)) },
          "details.travellers.date": {
            $gte: targetDateStart,
            $lte: targetDateEnd,
          },
        },
      },
      {
        $project: {
          bus: "$details.bus",
          travellerCount: { $size: "$details.travellers" },
        },
      },
      {
        $group: {
          _id: "$bus",
          totalBooked: { $sum: "$travellerCount" },
        },
      },
    ]);

    const bookedMap = {};
    bookings.forEach(b => {
      bookedMap[b._id.toString()] = b.totalBooked;
    });

    // Final response
    const result = filteredBuses.map(bus => {
      const booked = bookedMap[bus._id.toString()] || 0;
      return {
        busName: bus.name,
        busNumber: bus.busNumber,
        total: bus.totalSeats,
        booked,
        available: Math.max(bus.totalSeats - booked, 0),
      };
    });

    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching bus inventory:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//---------------------------------------------------

export const addHotel = async (req, res) => {
  try {
    const { name, location, description, images, amenities } = req.body;
    if (!name || !location || !description) {
      return res.status(400).json({ message: 'Required fields missing.' });
    }
    const newHotel = new Hotel({
      name,
      location,
      description,
      images: images || [],
      amenities: amenities || [],
      owner: req.user.id,
    });

    await newHotel.save();
    res.status(201).json(newHotel);
  } catch (error) {
    console.error('Error adding hotel:', error);
    res.status(500).json({ message: 'Server error while adding hotel.' });
  }
}
export const addRoom = async (req, res) => {
  try {
    let {
      roomType,
      price,
      capacity,
      amenities,
      images,
      totalRooms,
      hotelId
    } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const newRoom = new Room({
      roomType,
      pricePerNight: price,
      totalRooms,
      capacity,
      amenities,
      images,
      hotel: hotelId
    });

    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while adding room" });
  }
}
export const deleteHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const ownerId = req.user.id;
    console.log('hotelId : ', hotelId, "OwnerId : ", ownerId)
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    console.log(hotel)
    if (req.user.role === 'VENDOR' && Number(hotel.owner) !== Number(ownerId)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this hotel' });
    }

    await Room.deleteMany({ hotel: hotelId });
    await Hotel.deleteOne({ _id: hotelId });

    res.json({ success: true, message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ success: false, message: 'Server error deleting hotel' });
  }
}
export const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const userId = req.user.id;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    const hotel = await Hotel.findById(room.hotel);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Associated hotel not found' });
    }
    if (req.user.role === 'VENDOR' && hotel.owner.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this room' });
    }
    await Room.findByIdAndDelete(roomId);
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ success: false, message: 'Server error deleting room' });
  }
}
export const updateHotel = async (req, res) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedHotel) return res.status(404).json({ success: false, message: "Hotel not found" });
    res.status(200).json({ success: true, hotel: updatedHotel });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
}
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.status(200).json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.status(200).json({ success: true, message: 'Room updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update room' });
  }
}
//--------------------------------------------------

export const getVendorHotelBookings = async (req, res) => {
  try {
    const owner = req.user.id;
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.min(Math.max(1, parseInt(req.query.limit)) || 10, 50);
    const skip = (page - 1) * limit;
    const { status, startDate, endDate } = req.query;

    // Step 1: Get all hotels owned by vendor
    const vendorHotels = await Hotel.find({ owner }).select("_id");
    const hotelIds = vendorHotels.map(h => h._id.toString());
    if (hotelIds.length === 0) {
      return res.status(200).json({
        success: true,
        bookings: [],
        total: 0,
        page,
        pages: 0,
      });
    }

    // Step 2: Auto-complete old bookings
    const today = new Date();
    await UnifiedBooking.updateMany(
      {
        bookingType: "hotel",
        "details.hotel": { $in: hotelIds.map(id => new mongoose.Types.ObjectId(id)) },
        "details.checkOut": { $lt: today },
        status: { $ne: "completed" },
      },
      { $set: { status: "completed" } }
    );

    // Step 3: Build query
    const query = {
      bookingType: "hotel",
      "details.hotel": { $in: hotelIds.map(id => new mongoose.Types.ObjectId(id)) },
    };
    if (status) query.status = status;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (!isNaN(start) && !isNaN(end)) {
        query["details.checkIn"] = { $gte: start, $lte: end };
      }
    }

    // Step 4: Fetch data
    const total = await UnifiedBooking.countDocuments(query);
    const bookings = await UnifiedBooking.find(query)
      .sort({ "details.checkIn": -1 })
      .skip(skip)
      .limit(limit)
      .populate("details.hotel")
      .populate("details.room"); // Optional if you have room populated

    return res.status(200).json({
      success: true,
      bookings,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Vendor Hotel Booking Fetch Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getVendorBusBookings = async (req, res) => {
  try {
    const owner = req.user.id;

    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.min(Math.max(1, parseInt(req.query.limit)) || 10, 50);
    const skip = (page - 1) * limit;

    const { status, startDate, endDate } = req.query;

    // Step 1: Fetch buses owned by vendor
    const vendorBuses = await Bus.find({ owner }).select("_id");
    const busIds = vendorBuses.map(b => b._id.toString());

    if (busIds.length === 0) {
      return res.status(200).json({
        success: true,
        bookings: [],
        total: 0,
        page,
        pages: 0
      });
    }

    // Step 2: Mark bookings as Completed if journeyDate + 24 hours < now
    const now = new Date();
    await UnifiedBooking.updateMany(
      {
        bookingType: "bus",
        "details.bus": { $in: busIds.map(id => new mongoose.Types.ObjectId(id)) },
        "details.journeyDate": { $lte: new Date(now.getTime() - 86400000) }, // 24h ago
        status: { $ne: "completed" }
      },
      { $set: { status: "completed" } }
    );

    // Step 3: Build query with filters
    const query = {
      bookingType: "bus",
      "details.bus": { $in: busIds.map(id => new mongoose.Types.ObjectId(id)) }
    };

    if (status) query.status = status;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (!isNaN(start) && !isNaN(end)) {
        query["details.journeyDate"] = { $gte: start, $lte: end };
      }
    }

    // Step 4: Fetch bookings with pagination
    const total = await UnifiedBooking.countDocuments(query);
    const bookings = await UnifiedBooking.find(query)
      .populate("details.bus")
      .sort({ "details.journeyDate": -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      bookings,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Vendor Bus Booking Fetch Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const allListingsByVendor = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const hotels = await Hotel.find({ owner: vendorId });
    const hotelListings = [];

    for (const hotel of hotels) {
      const rooms = await Room.find({ hotel: hotel._id });
      const roomTypeCounts = {};
      for (const room of rooms) {
        roomTypeCounts[room.roomType] = (roomTypeCounts[room.roomType] || 0) + 1;
      }
      hotelListings.push({
        ...hotel.toObject(),
        totalRooms: rooms.length,
        roomTypeCounts,
        rooms,
      });
    }
    const buses = await Bus.find({ owner: vendorId });
    const busIds = buses.map((bus) => bus._id);
    const routes = await Route.find({ bus: { $in: busIds } });
    res.json({
      success: true,
      listings: {
        hotels: hotelListings,
        buses,
        routes,
      },
    });

  } catch (error) {
    console.error("Error fetching vendor listings:", error);
    res.status(500).json({ success: false, message: "Server error fetching listings" });
  }
};
//--------------------------------------------------------


export const deleteBus = async (req, res) => {
  try {

    const { id } = req.params;

    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    if (req.user.role === 'vendor' && bus.owner !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this bus' });
    }
    await Route.deleteMany({ bus: id });
    await Seat.deleteMany({ bus: id });
    await Bus.findByIdAndDelete(id);

    res.status(200).json({ message: 'Bus, routes, and seats deleted successfully' });
  } catch (error) {
    console.error('Error deleting bus:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

