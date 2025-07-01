import Stripe from 'stripe';
import Booking from '../models/Hotel/bookingModel.js';
import Hotel from '../models/Hotel/hotelModel.js';
import updateHotelReviewStats from '../models/Hotel/reviewHandler.js';
import Review from '../models/Hotel/reviewModel.js';
import Room from '../models/Hotel/roomModel.js';
import UnifiedBooking from "../models/booking.js"
import { KNOWN_CITIES } from '../utils/knowcities.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const hotelCity = async (req, res) => {
  try {
    const locations = await Hotel.distinct("location");
    const cities = new Set();
    for (const loc of locations) {
      for (const city of KNOWN_CITIES) {
        const regex = new RegExp(`\\b${city}\\b`, "i");
        if (regex.test(loc)) {
          cities.add(city);
          break;
        }
      }
    }
    res.json([...cities]);
  } catch (error) {
    console.error("Error fetching cities:", error.message);
    res.status(500).json({ message: "Failed to load city suggestions" });
  }
};

export const getAllHotel = async (req, res) => {
  try {
    const { city, maxPrice, page = 1, limit = 10, checkIn, checkOut, totalRooms } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));
    let hotelPriceData = [];
    if (maxPrice) {
      hotelPriceData = await Room.aggregate([
        { $match: { pricePerNight: { $lte: Number(maxPrice) } } },
        {
          $group: {
            _id: "$hotel",
            minPrice: { $min: "$pricePerNight" }
          }
        }
      ]);
      if (hotelPriceData.length === 0) return res.json({ success: true, total: 0, page: pageNum, limit: limitNum, hotels: [] });
    } else {
      hotelPriceData = await Room.aggregate([
        {
          $group: {
            _id: "$hotel",
            minPrice: { $min: "$pricePerNight" }
          }
        }
      ]);
    }
    const hotelIdsByPrice = hotelPriceData.map(h => h._id);
    let availableRoomHotelIds = [];
    if (checkIn && checkOut && totalRooms) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const rooms = await Room.find();
      for (const room of rooms) {
        const overlappingBookings = await Booking.find({
          room: room._id,
          $or: [
            {
              checkIn: { $lt: checkOutDate },
              checkOut: { $gt: checkInDate }
            }
          ]
        });
        const bookedCount = overlappingBookings.reduce((sum, b) => sum + (b.totalRoomsBooked || 0), 0);
        const availableCount = room.totalRooms - bookedCount;
        if (availableCount >= Number(totalRooms)) {
          availableRoomHotelIds.push(room.hotel.toString());
        }
      }
    }
    const hotelFilter = {};
    if (city) hotelFilter.location = { $regex: city, $options: "i" };
    if (hotelIdsByPrice.length > 0) hotelFilter._id = { $in: hotelIdsByPrice };
    if (availableRoomHotelIds.length > 0) {
      hotelFilter._id = {
        ...(hotelFilter._id || {}),
        $in: availableRoomHotelIds
      };
    } else if (checkIn && checkOut && totalRooms) {
      return res.json({ success: true, total: 0, page: pageNum, limit: limitNum, hotels: [] });
    }
    const total = await Hotel.countDocuments(hotelFilter);
    const hotels = await Hotel.find(hotelFilter)
      .sort({ rating: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
    const priceMap = new Map();
    hotelPriceData.forEach(h => priceMap.set(h._id.toString(), h.minPrice));
    const hotelsWithPrice = hotels.map(hotel => ({
      ...hotel.toObject(),
      minRoomPrice: priceMap.get(hotel._id.toString()) ?? null
    }));
    res.json({ success: true, total, page: pageNum, limit: limitNum, hotels: hotelsWithPrice });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getHotelByID = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    const rooms = await Room.find({ hotel: hotel._id });
    const reviews = await Review.find({ hotel: hotel._id }).sort({ createdAt: -1 })
    res.json({ hotel, rooms, reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { id: userId, first_name, last_name } = req.user;
    const name = `${first_name} ${last_name}`;
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ message: "Missing Stripe session_id" });
    }

    // Check for duplicate booking using session ID
    const existing = await UnifiedBooking.findOne({
      bookingType: "hotel",
      "stripe.sessionId": session_id,
    });
    if (existing) {
      return res.status(400).json({ message: "Booking already created for this session." });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const metadata = session.metadata;
    if (!metadata || !metadata.bookingDetails || !session.amount_total) {
      return res.status(400).json({ message: "Incomplete session metadata." });
    }

    const bookingDetails = JSON.parse(metadata.bookingDetails);
    const {
      hotelId: hotel,
      roomId: room,
      checkIn,
      checkOut,
      totalGuests,
      totalRooms
    } = bookingDetails;

    const totalAmount = session.amount_total / 100; // Stripe stores amount in cents

    if (!hotel || !room || !checkIn || !checkOut || !totalGuests || !totalRooms) {
      return res.status(400).json({ message: "Missing booking details in metadata." });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate >= checkOutDate)
      return res.status(400).json({ success: false, message: "Check-out must be after check-in." });

    if (checkInDate < today)
      return res.status(400).json({ success: false, message: "Booking date must be today or in the future." });

    const stayDuration = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
    if (stayDuration > 15)
      return res.status(400).json({ success: false, message: "Booking cannot exceed 15 days." });

    const advanceDays = (checkInDate - today) / (1000 * 60 * 60 * 24);
    if (advanceDays > 180)
      return res.status(400).json({ success: false, message: "Booking cannot be more than 6 months in advance." });

    // Room validations
    const roomData = await Room.findById(room);
    if (!roomData)
      return res.status(404).json({ success: false, message: "Room not found." });

    const roomCapacity = roomData.totalRooms;

    const overlappingBookings = await UnifiedBooking.find({
      bookingType: "hotel",
      status: "confirmed",
      'details.room': room,
      $or: [
        { 'details.checkIn': { $lt: checkOutDate }, 'details.checkOut': { $gt: checkInDate } }
      ]
    });

    const roomsBooked = overlappingBookings.reduce((sum, b) => sum + (b.details.totalRooms || 0), 0);
    const roomsAvailable = roomCapacity - roomsBooked;

    if (roomsAvailable < totalRooms) {
      return res.status(400).json({
        success: false,
        message: `Only ${roomsAvailable} room(s) available for the selected dates.`
      });
    }

    const hotelDoc = await Hotel.findById(hotel);
    if (!hotelDoc)
      return res.status(404).json({ success: false, message: "Hotel not found." });

    // Save booking
    const newBooking = new UnifiedBooking({
      user: userId,
      bookingType: "hotel",
      status: "confirmed",
      paymentStatus: "paid",
      bookingDate: new Date(),
      amount: totalAmount,
      stripe: {
        sessionId: session.id,
      },
      details: {
        hotel,
        room,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalGuests,
        totalRooms,
        bookedBy: name
      }
    });

    await newBooking.save();

    return res.status(201).json({
      success: true,
      message: "✅ Hotel booking created successfully.",
    });

  } catch (error) {
    console.error("❌ Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


export const getUserBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findById(id);
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

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id?.toString();
    const { checkIn, checkOut, totalGuests, totalRoomsBooked } = req.body;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    if (booking.status === "Cancelled" || booking.status === "Completed") return res.status(400).json({ message: "This is already cancelled" })
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this booking.' });
    }
    const now = new Date();
    if (new Date(booking.checkIn) - now <= 24 * 60 * 60 * 1000) {
      return res.status(400).json({ message: 'Cannot update booking less than 24 hours before check-in.' });
    }
    const hotelRooms = await Room.findOne({ hotel: booking.hotel });
    if (!hotelRooms) return res.status(404).json({ message: 'Hotel room info not found.' });

    const overlappingBookings = await Booking.find({
      hotel: booking.hotel,
      _id: { $ne: booking._id },
      checkOut: { $gt: new Date(checkIn) },
      checkIn: { $lt: new Date(checkOut) },
    });

    const roomsBooked = overlappingBookings.reduce((sum, b) => sum + b.totalRoomsBooked, 0);
    const roomsAvailable = hotelRooms.totalRooms - roomsBooked;

    if (totalRoomsBooked > roomsAvailable) {
      return res.status(400).json({
        message: `Only ${roomsAvailable} rooms available for these dates.`,
      });
    }

    booking.checkIn = new Date(checkIn);
    booking.checkOut = new Date(checkOut);
    booking.totalGuests = totalGuests;
    booking.totalRoomsBooked = totalRoomsBooked;

    await booking.save();

    return res.status(200).json({ message: 'Booking updated successfully.', booking, success: true });
  } catch (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

export const deleteUserBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found." });

    if (booking.userId !== userId)
      return res.status(403).json({ success: false, message: "Unauthorized." });

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: "Booking is already cancelled." });
    }

    const now = new Date();
    const checkIn = new Date(booking.checkIn);
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
    const hotel = await Hotel.findById(targetId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized or invalid booking' });
    }

    if (booking.hotel.toString() !== targetId) {
      return res.status(400).json({ message: 'Booking does not match hotel' });
    }

    const review = new Review({
      hotel: targetId,
      booking: bookingId,
      userId,
      rating,
      comment,
    });

    await review.save();
    await updateHotelReviewStats(targetId);
    res.status(201).json({ message: 'Review submitted successfully.' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Review already submitted for this booking.' });
    }
    console.error('Review POST error:', err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
}

