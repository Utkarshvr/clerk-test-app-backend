import { Router } from "express";
import webhookRoute from "@/routes/webhook.routes";
import privateResourcesRoute from "./private-resources.routes";

const rootRoute = Router();

rootRoute.get("/", (req, res) => {
  res.json("Welcome to the Clerk Test Resource API");
});

rootRoute.use("/webhooks", webhookRoute);

rootRoute.use("/private-resources", privateResourcesRoute);

export default rootRoute;
