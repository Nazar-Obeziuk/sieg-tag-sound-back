import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema(
  {
    track_before: {
      type: String,
      required: true,
    },
    track_after: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Portfolio", PortfolioSchema);
