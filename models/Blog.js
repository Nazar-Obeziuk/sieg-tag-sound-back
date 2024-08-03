import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    image_url: {
      type: String,
      unique: true,
    },
    descriptions: {
      type: Array,
      default: [],
    },
    blog_language: {
      type: String,
      required: true,
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

export default mongoose.model("Blog", BlogSchema);
