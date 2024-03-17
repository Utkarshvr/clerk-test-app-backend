import mongoose from "mongoose";

const docSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Docs = mongoose.model("docs", docSchema);

export default Docs;
