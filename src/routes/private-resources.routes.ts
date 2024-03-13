import { Router } from "express";
import isAuth from "@/middlewares/auth/isAuth";
import AuthenticatedRequest from "@/types/express";
import Users from "@/models/Users.models";

const privateResourcesRoute = Router();

privateResourcesRoute.use(isAuth);

privateResourcesRoute.get("/", (req, res) => {
  res.send("If u received this, then u are authenticated");
});

privateResourcesRoute.get(
  "/clerk-profile",
  (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (user) res.status(200).json({ user });
    else
      res.status(403).json({
        message: "You are not loggedin bro to recieve your profile info",
      });
  }
);

privateResourcesRoute.get(
  "/mongodb-profile",
  async (req: AuthenticatedRequest, res) => {
    const clerkID = req.user.clerkID;

    try {
      const user = await Users.findOne({ clerkID });

      if (user) res.status(200).json({ user });
      else
        res.status(403).json({
          message: `User with Clerk ID: ${clerkID} is not found in the Database`,
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: `Internal Server Error`,
      });
    }
  }
);

export default privateResourcesRoute;
