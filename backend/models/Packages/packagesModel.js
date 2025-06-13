import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["single", "multi"], required: true },
    description: String,
    pricePerPerson: { type: Number, required: true },
    duration: { type: String }, // e.g., "3 Days 2 Nights"

    citiesCovered: [
      {
        cityName: { type: String, required: true },
        stayNights: Number,
        hotels: [
          {
            hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
            roomId: { type: mongoose.Schema.Types.ObjectId }, // from hotel's rooms[]
          },
        ],
        activities: [
          {
            name: { type: String, required: true },
            description: String,
            time: String, // optional time or schedule
            image: String,
            cost: Number,
          },
        ],
      },
    ],

    // 🛫 Improved Transport Logic
    transports: [
      {
        fromCity: { type: String, required: true },
        toCity: { type: String, required: true },
        mode: {
          type: String,
          enum: ["Flight", "Train", "Bus"],
          required: true,
        },
        refId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "transports.mode",
        },
        classOrSeat: { type: String },
        departureDate: { type: Date }, // 🔥 added: actual departure date of the transport
        departureTime: { type: String }, // optional: "14:30"
        arrivalTime: { type: String }, // optional: "18:45"
      },
    ],

    // 🗓️ Departure Info (when the full package starts)
    departureInfo: {
      type: {
        type: String,
        enum: ["fixed", "recurring"],
        required: true,
      },
      fixedDates: [Date],
      recurringRule: {
        frequency: String, // "weekly", "monthly", etc.
        dayOfWeek: [String], // ["Monday", "Friday"]
      },
    },

    // 🔗 Optional Reference for internal mapping / marketing
    referenceId: String,

    images: [String],

    cancellationPolicy: {
      type: String,
      enum: ["strict", "moderate", "flexible"],
      default: "moderate",
    },

    tags: [String],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);
