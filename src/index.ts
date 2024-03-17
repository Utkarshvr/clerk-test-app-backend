import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import connectToDB from "@/utils/connectToDB";
import rootRoute from "@/routes/root.routes";
import clerkClient from "@clerk/clerk-sdk-node";

const app = express();
connectToDB();

// app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    // credentials: true,
  })
);

app.get("/", async (req, res) => {
  try {
    // const user = await clerkClient.users.getUser(
    //   "user_2dfUmmUCjp6MSKAN8IWvwSY6zB8"
    // );
    const users = await clerkClient.users.getUserList();

    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

app.use("/api", rootRoute);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(5000, () => {
    console.log("👂 Server is running on: http://localhost:5000");
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
