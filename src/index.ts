import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import connectToDB from "@/utils/connectToDB";
import rootRoute from "@/routes/root.routes";

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

app.get("/", (req, res) => {
  res.json("WORKING ✅");
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
