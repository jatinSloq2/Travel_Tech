import mongoose from 'mongoose';
import Train from './trainModel.js';
import Station from './stationModel.js';
import TrainSeat from './trainSeatModel.js';

const mongoUri = 'mongodb://localhost:27017/Travel_DB';

// Helper Functions
const getTrainName = () => {
  const prefixes = [
    'Rajdhani',
    'Shatabdi',
    'Duronto',
    'Garib Rath',
    'Jan Shatabdi',
    'Humsafar',
    'Tejas',
    'Antyodaya',
    'Superfast',
    'Intercity',
    'Mail',
    'Express',
    'Vande Bharat',
    'Sampark Kranti',
    'Double Decker'
  ];
  const suffixes = [
    'Exp',
    'Special',
    'SF',
    'AC Express',
    'Link Express',
    'Weekly Express',
    'Daily Express',
    'Janata Express',
    'Passenger',
    'Tatkal',
    'Night Rider',
    'Morning Star',
    'Falcon',
    'Arrow',
    'Racer'
  ];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

const generateTrainNumber = () => String(Math.floor(10000 + Math.random() * 90000));

const getTimeString = (minutes) => {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const averageSpeeds = {
  'Rajdhani': 85,
  'Shatabdi': 90,
  'Duronto': 80,
  'Garib Rath': 70,
  'Superfast': 65,
  'Express': 55,
  'Intercity': 60,
  'Mail': 50,
  'Passenger': 40,
  'Vande Bharat': 95,
  'Humsafar': 75
};

const getTrainBaseSpeed = (trainName) => {
  const prefix = trainName.split(" ")[0];
  return averageSpeeds[prefix] || 55; // Fallback speed
};

// Generates a progressive route with increasing times
const generateRoute = (stations, trainName) => {
  const route = [];
  let distance = 0;
  let timeMinutes = 6 * 60; // Start at 6:00 AM
  const speed = getTrainBaseSpeed(trainName);

  for (let i = 0; i < stations.length; i++) {
    const arrivalTime = i === 0 ? null : getTimeString(timeMinutes);

    const haltMinutes = (i === 0 || i === stations.length - 1) ? 0 : 2 + Math.floor(Math.random() * 6);
    timeMinutes += haltMinutes;

    const departureTime = i === stations.length - 1 ? null : getTimeString(timeMinutes);

    // Realistic segment distance
    const segmentDistance = i === stations.length - 1 ? 0 : 80 + Math.floor(Math.random() * 100); // 80–180 km

    const travelMinutes = i === stations.length - 1 ? 0 : Math.round((segmentDistance / speed) * 60);
    timeMinutes += travelMinutes;

    route.push({
      station: stations[i]._id,
      arrivalTime,
      departureTime,
      distance,
      dayOffset: Math.floor(distance / 700),
    });

    distance += segmentDistance;
  }

  return route;
};


const generateSeats = async (trainId, seatTypes) => {
  for (const seatType of seatTypes) {
    const seats = [];
    for (let i = 1; i <= seatType.totalSeats; i++) {
      seats.push({
        seatNumber: `${seatType.class}-${i}`,
        bookings: [],
      });
    }

    await TrainSeat.create({
      train: trainId,
      class: seatType.class,
      totalSeats: seatType.totalSeats,
      seats,
    });
  }
};

const seed = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');

    await Train.deleteMany({});
    await TrainSeat.deleteMany({});
    console.log('🧹 Cleared old trains and seats');

    const stations = await Station.find();
    if (stations.length < 6) {
      throw new Error('⚠️ Add at least 6+ stations in your DB to generate routes');
    }

    const trainCount = 120;
    const startDate = new Date('2025-06-01');

    const getTotalRouteDistance = (route) => {
      return route[route.length - 1].distance;
    };

    const getOperatingDays = () => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 3);
    };

    for (let i = 0; i < trainCount; i++) {
      const shuffled = [...stations].sort(() => 0.5 - Math.random());
      const routeStations = shuffled.slice(0, Math.floor(Math.random() * 3) + 4);

      const trainName = getTrainName();
      const route = generateRoute(routeStations, trainName);
      const routeId = `R${1000 + i}`;

      const seatTypes = [
        { class: 'SL', totalSeats: 72, fare: 120 + Math.floor(Math.random() * 100) },
        { class: '3A', totalSeats: 64, fare: 400 + Math.floor(Math.random() * 200) },
      ];

      const departureDate = new Date(startDate);
      departureDate.setDate(departureDate.getDate() + i);

      const upTrain = await Train.create({
        trainNumber: generateTrainNumber(),
        name: trainName,
        operatingDays: getOperatingDays(),
        routeId,
        direction: 'UP',
        route,
        seatTypes,
        departureDate,
        isActive: true,
      });

      await generateSeats(upTrain._id, seatTypes);
      console.log(`🚆 UP Train inserted: ${upTrain.name} on ${departureDate.toISOString().slice(0, 10)}`);

      const turnaroundDays = 2;
      const totalDistance = getTotalRouteDistance(route);
      const travelDays = Math.ceil(totalDistance / 700);

      const downDepartureDate = new Date(departureDate);
      downDepartureDate.setDate(downDepartureDate.getDate() + travelDays + turnaroundDays);

      const downRoute = [...route].reverse().map((stop, index, arr) => {
        const original = arr[arr.length - 1 - index];
        return {
          ...stop,
          arrivalTime: original.arrivalTime,
          departureTime: original.departureTime,
          dayOffset: original.dayOffset,
        };
      });

      const downTrain = await Train.create({
        trainNumber: generateTrainNumber(),
        name: getTrainName(),
        operatingDays: getOperatingDays(),
        routeId,
        direction: 'DOWN',
        route: downRoute,
        seatTypes,
        departureDate: downDepartureDate,
        isActive: true,
      });

      await generateSeats(downTrain._id, seatTypes);
      console.log(`⬇️  DOWN Train inserted: ${downTrain.name} on ${downDepartureDate.toISOString().slice(0, 10)}`);
    }

    console.log(`✅ Successfully inserted ${trainCount * 2} trains`);
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  } catch (err) {
    console.error('❌ Error seeding trains:', err.message);
  }
};

seed();
