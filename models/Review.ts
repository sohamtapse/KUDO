import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  repo: String,
  commitSha: String,
  diff: String,
  originalCode: String,
  review: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
