const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        "clinic",
        "vaccination",
        "emergency",
        "mental_wellness",
        "preventive_care",
        "public_health"
      ]
    },

    description: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    contactInformation: {
      type: String,
      required: true
    },

    availability: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Resource", resourceSchema);
