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
      unique: true,
    },
    category: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    text: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Portfolio", PortfolioSchema);
