const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      enum: [
        "general_health",
        "nutrition",
        "hygiene",
        "vaccination",
        "first_aid",
        "preventive_care",
        "mental_wellness",
        "healthy_lifestyle"
      ],
      default: "general_health"
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "answered"],
      default: "pending"
    },

    answer: {
      type: String,
      default: ""
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Question", questionSchema);