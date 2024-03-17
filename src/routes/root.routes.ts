import { Router, json } from "express";
import webhookRoute from "@/routes/webhook.routes";
import privateResourcesRoute from "./private-resources.routes";
import docsRoute from "./docs.routes";
import docsRouteBeta from "./docs-beta.routes";

const rootRoute = Router();

rootRoute.use("/webhooks", webhookRoute);

rootRoute.use(json());

rootRoute.get("/", (req, res) => {
  res.json("Welcome to the Clerk Test Resource API");
});

rootRoute.use("/docs", docsRoute);
rootRoute.use("/docs-beta", docsRouteBeta);

rootRoute.use("/private-resources", privateResourcesRoute);

export default rootRoute;
