import mongoose from "mongoose";

const PriceSchema = new mongoose.Schema(
  {
    track_mixmas: {
      type: String,
      required: true,
    },
    track_mix: {
      type: String,
      required: true,
    },
    track_mas: {
      type: String,
      required: true,
    },
    ep_mixmas: {
      type: String,
      required: true,
    },
    ep_mix: {
      type: String,
      required: true,
    },
    ep_mas: {
      type: String,
      required: true,
    },
    album_mixmas: {
      type: String,
      required: true,
    },
    album_mix: {
      type: String,
      required: true,
    },
    album_mas: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Price", PriceSchema);
