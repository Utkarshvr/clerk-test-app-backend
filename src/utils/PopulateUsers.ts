import clerkClient from "@clerk/clerk-sdk-node";

export default async function PopulateUsers(
  MDB_DocumentModel: any,
  MDB_Docs: any,
  userFieldName: "user" | "creator" | string
) {
  const idSet = new Set(MDB_Docs.map((doc: any) => doc[userFieldName]));

  for (const doc of MDB_Docs) {
    try {
      const originalUser = doc[userFieldName];

      const { user } = await MDB_DocumentModel.populate(doc, {
        path: userFieldName,
      });

      if (user) doc[userFieldName] = user;
      else doc[userFieldName] = originalUser;
    } catch (error) {
      console.log(error);
    }
  }

  const nonPopulatedDocs = MDB_Docs.filter(
    (doc: any) =>
      typeof doc[userFieldName] === "string" &&
      !(doc[userFieldName] as unknown as { username: string } | null)?.username
  );

  if (nonPopulatedDocs.length === 0) return MDB_Docs;

  // If there are some users left unpopulated, then try to populate them from clerk users
  const nonPopulatedUsers = [
    ...new Set(
      MDB_Docs.filter(
        (doc: any) =>
          typeof doc[userFieldName] === "string" &&
          !(doc[userFieldName] as unknown as { username: string } | null)
            ?.username
      ).map((doc: any) => doc[userFieldName])
    ),
  ];
  //   console.log({ nonPopulatedUsers });

  const allNonPopulatedClerkUsers = await Promise.all(
    nonPopulatedUsers.map(async (id: string) => {
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

  nonPopulatedDocs.forEach((doc: any) => {
    // Find the user corresponding to the document's userID
    const user = allNonPopulatedClerkUsers.find(
      (clerkUser) => clerkUser.id === doc[userFieldName]
    );
    // Assign the user to the document
    (doc[userFieldName] as any) = user;
  });

  const mergedDocs = MDB_Docs.concat(
    nonPopulatedDocs.filter(
      (doc: any) => !idSet.has((doc[userFieldName] as any)?.id)
    )
  );
  return mergedDocs;
}
