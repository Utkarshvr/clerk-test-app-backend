import jwt, { VerifyErrors } from "jsonwebtoken";
import { NextFunction, Response } from "express";
import AuthenticatedRequest from "@/types/express";

export default function isAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token =
    req.headers.authorization ||
    req.headers.Authorization ||
    req.cookies.__session;

  console.log({ token });

  if (!token)
    return res.status(401).json({
      message: "JWT Token is not provided",
    });

  jwt.verify(
    token,
    process.env.CLERK_PEM_PUBLIC_KEY,
    (err: VerifyErrors | null, decoded: any) => {
      if (err)
        return res.status(403).json({
          message: err.message,
        });

      req.user = {
        clerkID: decoded.clerkID,
        picture: decoded.picture,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        fullName: decoded.fullName,
        username: decoded.clerkID,
        hasPicture: decoded.hasPicture,
        phoneNumber: decoded.phoneNumber,
        primaryEmail: decoded.primaryEmail,
        isEmailVerified: decoded.isEmailVerified,
      };

      next();
    }
  );
}
