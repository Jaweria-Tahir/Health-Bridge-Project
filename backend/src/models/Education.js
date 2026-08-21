const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        "nutrition",
        "hygiene",
        "vaccination",
        "first_aid",
        "preventive_care",
        "healthy_lifestyle"
      ]
    },

    summary: {
      type: String,
      required: true
    },

    content: {
      type: String,
      required: true
    },

    source: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published"
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

module.exports = mongoose.model("Education", educationSchema);