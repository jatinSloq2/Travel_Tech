import { fetchUsers } from "../db/query/userQueries.js";
import Hotel from "../models/Hotel/hotelModel.js";
import Room from "../models/Hotel/roomModel.js";
import Bus from "../models/Bus/busModel.js";
import Route from "../models/Bus/busRouteModel.js";
import Flight from "../models/Flights/flightModel.js";
import Train from "../models/Train/trainModel.js";
import UnifiedBooking from "../models/booking.js"

import { getDateRange } from "../utils/getDateRange.js";

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const role = req.query.role && req.query.role !== 'ALL' ? req.query.role : null;

    const data = await fetchUsers(page, limit, role);

    res.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
export const getAllListings = async (req, res) => {
  const { ownerId, page = 1 } = req.query;
  const PAGE_SIZE = 20;
  const pageNumber = Number(page) > 0 ? Number(page) : 1;

  console.log("Incoming req.query:", req.query);

  try {
    let filter = {};
    if (ownerId) {
      const ownerIdNum = Number(ownerId);
      if (!isNaN(ownerIdNum)) {
        filter.owner = ownerIdNum;
      } else {
        console.log("ownerId query param is not a valid number");
      }
      console.log("Using filter:", filter);
    } else {
      console.log("No ownerId filter applied.");
    }

    // Hotels with pagination
    const hotels = await Hotel.find(filter)
      .skip((pageNumber - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean();
    console.log(`Found ${hotels.length} hotels with filter`);

    const hotelIds = hotels.map((hotel) => hotel._id);
    const rooms = await Room.find({ hotel: { $in: hotelIds } }).lean();
    const hotelListings = hotels.map((hotel) => {
      const hotelRooms = rooms.filter(
        (room) => room.hotel.toString() === hotel._id.toString()
      );
      return { ...hotel, rooms: hotelRooms };
    });

    // Buses with pagination
    const buses = await Bus.find(filter)
      .skip((pageNumber - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean();
    console.log(`Found ${buses.length} buses with filter`);

    const busIds = buses.map((bus) => bus._id);
    const routes = await Route.find({ bus: { $in: busIds } }).lean();
    const busListings = buses.map((bus) => {
      const busRoutes = routes.filter(
        (route) => route.bus.toString() === bus._id.toString()
      );
      return { ...bus, routes: busRoutes };
    });

    // Flights with pagination
    const flightListings = await Flight.find(filter)
      .skip((pageNumber - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .populate("fromAirport")
      .populate("toAirport")
      .lean();
    console.log(`Found ${flightListings.length} flights with filter`);

    // Trains with pagination
    const trainListings = await Train.find(filter)
      .skip((pageNumber - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .populate({ path: "route.station", model: "Station" })
      .lean();
    console.log(`Found ${trainListings.length} trains with filter`);

    // You can also return total counts if you want to support frontend page counts:
    const hotelCount = await Hotel.countDocuments(filter);
    const busCount = await Bus.countDocuments(filter);
    const flightCount = await Flight.countDocuments(filter);
    const trainCount = await Train.countDocuments(filter);

    res.status(200).json({
      hotelListings,
      busListings,
      flightListings,
      trainListings,
      counts: {
        hotelCount,
        busCount,
        flightCount,
        trainCount,
      },
      page: pageNumber,
      pageSize: PAGE_SIZE,
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Server error while fetching listings" });
  }
};
export const getAllBookings = async (req, res) => {
  const {
    ownerId,
    status,
    page = 1,
    limit = 30,
    dateRange = "total",
    customStart,
    customEnd,
  } = req.query;

  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitInt = parseInt(limit);

    const createdAt = getDateRange(dateRange, {
      start: customStart,
      end: customEnd,
    });

    const baseFilter = {
      ...(status ? { status } : {}),
      ...(Object.keys(createdAt).length ? { createdAt } : {}),
    };

    const allBookings = await UnifiedBooking.find(baseFilter).lean();

    // OWNER filter logic
    let filteredBookings = allBookings;

    if (ownerId) {
      const ownerIdStr = String(ownerId);

      const flightIds = [];
      const busIds = [];
      const hotelIds = [];
      const trainIds = [];

      for (let booking of allBookings) {
        const type = booking.bookingType;
        if (type === "flight" && booking.details?.flights?.length) {
          booking.details.flights.forEach(f => flightIds.push(f.flight));
        } else if (type === "bus" && booking.details?.bus) {
          busIds.push(booking.details.bus);
        } else if (type === "hotel" && booking.details?.hotel) {
          hotelIds.push(booking.details.hotel);
        } else if (type === "train" && booking.details?.train) {
          trainIds.push(booking.details.train);
        }
      }

      const [flights, buses, hotels, trains] = await Promise.all([
        Flight.find({ _id: { $in: flightIds } }, { _id: 1, owner: 1 }).lean(),
        Bus.find({ _id: { $in: busIds } }, { _id: 1, owner: 1 }).lean(),
        Hotel.find({ _id: { $in: hotelIds } }, { _id: 1, owner: 1 }).lean(),
        Train.find({ _id: { $in: trainIds } }, { _id: 1, owner: 1 }).lean(),
      ]);

      const flightOwnerMap = new Map(flights.map(f => [f._id.toString(), f.owner.toString()]));
      const busOwnerMap = new Map(buses.map(b => [b._id.toString(), b.owner.toString()]));
      const hotelOwnerMap = new Map(hotels.map(h => [h._id.toString(), h.owner.toString()]));
      const trainOwnerMap = new Map(trains.map(t => [t._id.toString(), t.owner.toString()]));

      filteredBookings = allBookings.filter(b => {
        const type = b.bookingType;
        if (type === "flight" && b.details?.flights?.length) {
          return b.details.flights.some(f => flightOwnerMap.get(f.flight?.toString()) === ownerIdStr);
        } else if (type === "bus" && b.details?.bus) {
          return busOwnerMap.get(b.details.bus?.toString()) === ownerIdStr;
        } else if (type === "hotel" && b.details?.hotel) {
          return hotelOwnerMap.get(b.details.hotel?.toString()) === ownerIdStr;
        } else if (type === "train" && b.details?.train) {
          return trainOwnerMap.get(b.details.train?.toString()) === ownerIdStr;
        }
        return false;
      });
    }

    // Grouping + stats
    const counts = { hotel: 0, bus: 0, flight: 0, train: 0 };
    const amounts = { hotel: 0, bus: 0, flight: 0, train: 0 };
    const bookingsByType = { hotel: [], bus: [], flight: [], train: [] };

    for (let b of filteredBookings) {
      const type = b.bookingType;
      if (bookingsByType[type]) {
        counts[type]++;
        amounts[type] += b.amount || 0;
        bookingsByType[type].push(b);
      }
    }

    const paginate = arr =>
      arr
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(skip, skip + limitInt);

    res.status(200).json({
      hotelBookings: paginate(bookingsByType.hotel),
      busBookings: paginate(bookingsByType.bus),
      flightBookings: paginate(bookingsByType.flight),
      trainBookings: paginate(bookingsByType.train),
      counts: {
        ...counts,
        total: counts.hotel + counts.bus + counts.flight + counts.train,
      },
      amounts: {
        ...amounts,
        total: amounts.hotel + amounts.bus + amounts.flight + amounts.train,
      },
    });
  } catch (error) {
    console.error("❌ Error filtering unified bookings:", error);
    res.status(500).json({ message: "Server error while fetching bookings" });
  }
};










