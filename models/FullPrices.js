import mongoose from "mongoose";

const FullPriceSchema = new mongoose.Schema(
  {
    count: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    mixingAndMastering: {
      type: String,
      required: true,
    },
    mixing: {
      type: String,
      required: true,
    },
    mastering: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FullPrices", FullPriceSchema);
