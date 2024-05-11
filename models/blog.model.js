const mongoose = require("mongoose");
const {Schema} = mongoose

const Blog = new mongoose.Schema(
  {
    body: { type: String, required: true },
    state: {
      type: String,
      enum: {
        values: ["draft", "published"],
      },
      default: "draft",
    },
    author: { type: Schema.Types.ObjectId, ref: "blogUser" },
    title: { type: String, required: true },
    tags: { type: String },
    read_count: { type: Number, required: true , default: 0 },
    reading_time: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('blog', Blog);