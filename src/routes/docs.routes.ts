import isAuth from "@/middlewares/auth/isAuth";
import Docs from "@/models/Docs.models";
import AuthenticatedRequest from "@/types/express";
import clerkClient from "@clerk/clerk-sdk-node";
import { Router } from "express";

const docsRoute = Router();

docsRoute.get("/all", async (req, res) => {
  try {
    const docs = await Docs.find().lean();

    const idSet = new Set(docs.map((doc) => doc?.user));

    for (const doc of docs) {
      try {
        const originalUser = doc.user;
        // console.log({ originalUser });
        const { user } = await Docs.populate(doc, { path: "user" });
        // console.log(user, !!user);
        if (user) doc.user = user;
        else doc.user = originalUser;
      } catch (error) {
        console.log(error);
      }
    }

    const nonPopulatedDocs = docs.filter(
      (doc) =>
        typeof doc.user === "string" &&
        !(doc.user as unknown as { username: string } | null)?.username
    );

    if (nonPopulatedDocs.length === 0) return res.status(200).json({ docs });

    // If there are some users left unpopulated, then try to populate them from clerk users
    const nonPopulatedUsers = [
      ...new Set(
        docs
          .filter(
            (doc) =>
              typeof doc.user === "string" &&
              !(doc.user as unknown as { username: string } | null)?.username
          )
          .map((doc) => doc.user)
      ),
    ];
    console.log({ nonPopulatedUsers });

    const allNonPopulatedClerkUsers = await Promise.all(
      nonPopulatedUsers.map(async (id) => {
        try {
          const user = await clerkClient.users.getUser(id);
          return user;
        } catch (error) {
          console.log(error);
          return null;
        }
      })
    );
    console.log({ allNonPopulatedClerkUsers });

    nonPopulatedDocs.forEach((doc) => {
      // Find the user corresponding to the document's userID
      const user = allNonPopulatedClerkUsers.find(
        (clerkUser) => clerkUser.id === doc.user
      );
      // Assign the user to the document
      (doc.user as any) = user;
    });

    const mergedDocs = docs.concat(
      nonPopulatedDocs.filter((doc) => !idSet.has((doc.user as any)?.id))
    );

    console.log({ mergedDocs });
    return res.status(200).json({ docs: mergedDocs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

docsRoute.use(isAuth);

docsRoute.get("/", async (req: AuthenticatedRequest, res) => {
  try {
    const docs = await Docs.find({ user: req.user._id }).lean();

    const idSet = new Set(docs.map((doc) => doc?.user));

    for (const doc of docs) {
      try {
        const originalUser = doc.user;
        // console.log({ originalUser });
        const { user } = await Docs.populate(doc, { path: "user" });
        // console.log(user, !!user);
        if (user) doc.user = user;
        else doc.user = originalUser;
      } catch (error) {
        console.log(error);
      }
    }

    const nonPopulatedDocs = docs.filter(
      (doc) =>
        typeof doc.user === "string" &&
        !(doc.user as unknown as { username: string } | null)?.username
    );

    if (nonPopulatedDocs.length === 0) return res.status(200).json({ docs });

    // If there are some users left unpopulated, then try to populate them from clerk users
    const nonPopulatedUsers = [
      ...new Set(
        docs
          .filter(
            (doc) =>
              typeof doc.user === "string" &&
              !(doc.user as unknown as { username: string } | null)?.username
          )
          .map((doc) => doc.user)
      ),
    ];
    console.log({ nonPopulatedUsers });

    const allNonPopulatedClerkUsers = await Promise.all(
      nonPopulatedUsers.map(async (id) => {
        try {
          const user = await clerkClient.users.getUser(id);
          return user;
        } catch (error) {
          console.log(error);
          return null;
        }
      })
    );
    console.log({ allNonPopulatedClerkUsers });

    nonPopulatedDocs.forEach((doc) => {
      // Find the user corresponding to the document's userID
      const user = allNonPopulatedClerkUsers.find(
        (clerkUser) => clerkUser.id === doc.user
      );
      // Assign the user to the document
      (doc.user as any) = user;
    });

    const mergedDocs = docs.concat(
      nonPopulatedDocs.filter((doc) => !idSet.has((doc.user as any)?.id))
    );

    console.log({ mergedDocs });
    return res.status(200).json({ docs: mergedDocs });
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
