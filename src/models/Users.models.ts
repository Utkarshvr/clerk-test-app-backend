import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    picture: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    clerkID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("User", userSchema);

export default Users;
