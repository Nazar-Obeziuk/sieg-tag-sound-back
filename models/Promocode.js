import mongoose from "mongoose";

const PromocodeSchema = new mongoose.Schema(
  {
    promocode: {
      type: String,
      required: true,
      unique: true,
    },
    discount: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Promocode", PromocodeSchema);
