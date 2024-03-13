// express.d.ts
import { Request } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    // Define the structure of your user object here
    // For example, if user has an ID, you can define it like this:
    clerkID: string | null;

    username: string | null;

    fullName: string | null;

    firstName: string | null;
    lastName: string | null;

    hasPicture: boolean | null;
    picture: string | null;

    isEmailVerified: boolean | null;
    primaryEmail: string | null;

    phoneNumber: number | null;
  };
}

export default AuthenticatedRequest;
