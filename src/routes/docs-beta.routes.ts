import isAuth from "@/middlewares/auth/isAuth";
import Docs from "@/models/Docs.models";
import AuthenticatedRequest from "@/types/express";
import PopulateUsers from "@/utils/PopulateUsers";
import { Router } from "express";

const docsRoute = Router();

docsRoute.get("/all", async (req, res) => {
  try {
    const docs = await Docs.find().lean();

    const populatedDocs = await PopulateUsers(Docs, docs, "user");

    console.log({ populatedDocs });

    return res.status(200).json({ docs: populatedDocs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

docsRoute.use(isAuth);

docsRoute.get("/", async (req: AuthenticatedRequest, res) => {
  try {
    const docs = await Docs.find({ user: req.user._id }).lean();
    const populatedDocs = await PopulateUsers(Docs, docs, "user");

    return res.status(200).json({ docs: populatedDocs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

docsRoute.post("/", async (req: AuthenticatedRequest, res) => {
  try {
    const docs = await Docs.create({
      user: req.user._id,
      content: req.body?.content,
    });
    return res.status(200).json({ docs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

export default docsRoute;
