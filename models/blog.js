const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    author: {
      type: Schema.ObjectId,
      ref: "User",
    },
    state: {
      type: String,
      required: true,
      enum: ["draft", "published"],
      default: "draft",
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: String,
      required: true,
      default: "0s",
    },
    tags: [String],
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const blogModel = mongoose.model("Blog", BlogSchema);

module.exports = { blogModel };
