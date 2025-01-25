const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: { type: String, required: true },
    photoUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
