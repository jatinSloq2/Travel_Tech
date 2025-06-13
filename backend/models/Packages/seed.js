import mongoose from "mongoose";
import Package from "./packagesModel.js"; // Adjust the path as needed

// 🆕 Sample ObjectIds for demo
const mockHotelIdMumbai = "683f0b807b18cf000ab71cd7"
const mockRoomIdMumbai = "683f0c147b18cf000ab71cda"
const mockHotelIdGoa = "683f090a7b18cf000ab71ca3"
const mockRoomIdGoa = "683f095d7b18cf000ab71ca6"
const flightMumbaiToGoaId = "6841e38ac6ede012952051ca"
const flightGoaToMumbaiId = "6841e38ac6ede012952051cb"

const newPackage = new Package({
  name: "Mumbai to Goa Round Trip Delight",
  type: "multi",
  description: "Enjoy 3 nights in Mumbai and 3 nights in Goa with comfortable flights and exciting activities included.",
  pricePerPerson: 18999,
  duration: "6 Days 5 Nights",

  citiesCovered: [
    {
      cityName: "Mumbai",
      stayNights: 3,
      hotels: [
        {
          hotel: mockHotelIdMumbai,
          roomId: mockRoomIdMumbai,
        },
      ],
      activities: [
        {
          name: "Gateway of India Visit",
          description: "Explore the iconic monument and nearby marine drive.",
          time: "10:00 AM",
          image: "https://example.com/gateway.jpg",
          cost: 0,
        },
        {
          name: "Bollywood Studio Tour",
          description: "Visit a real Bollywood film studio with a guide.",
          time: "2:00 PM",
          image: "https://example.com/bollywood.jpg",
          cost: 500,
        },
      ],
    },
    {
      cityName: "Goa",
      stayNights: 3,
      hotels: [
        {
          hotel: mockHotelIdGoa,
          roomId: mockRoomIdGoa,
        },
      ],
      activities: [
        {
          name: "Beach Party at Baga",
          description: "Enjoy a beachside DJ party and sunset snacks.",
          time: "6:00 PM",
          image: "https://example.com/baga.jpg",
          cost: 300,
        },
        {
          name: "Old Goa Churches Tour",
          description: "Explore UNESCO heritage churches in North Goa.",
          time: "10:00 AM",
          image: "https://example.com/goa-churches.jpg",
          cost: 200,
        },
      ],
    },
  ],

  transports: [
    {
      fromCity: "Mumbai",
      toCity: "Goa",
      mode: "Flight",
      refId: flightMumbaiToGoaId,
      classOrSeat: "Economy",
      departureDate: new Date("2025-07-04"),
      departureTime: "08:00",
      arrivalTime: "09:30",
    },
    {
      fromCity: "Goa",
      toCity: "Mumbai",
      mode: "Flight",
      refId: flightGoaToMumbaiId,
      classOrSeat: "Economy",
      departureDate: new Date("2025-07-07"),
      departureTime: "17:00",
      arrivalTime: "18:30",
    },
  ],

  departureInfo: {
    type: "fixed",
    fixedDates: [new Date("2025-07-01")],
  },

  referenceId: "PKG-MUM-GOA-001",
  images: [
    "https://example.com/mumbai-view.jpg",
    "https://example.com/goa-beach.jpg",
  ],
  cancellationPolicy: "moderate",
  tags: ["beach", "city", "roundtrip", "flight", "relaxing"],
  isFeatured: true,
});

// ✅ Save the package
await newPackage.save();
console.log("✅ Package inserted successfully");
