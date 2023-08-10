import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
declare module "express-serve-static-core" {
  export interface Request {
    user: any;
  }
}
export const creeateJwt = (user: { id: string; email: string }) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },

    process.env.JWT_SECRET_KEY?.toString()!,
    { expiresIn: 60 * 60 }
  );
  return token;
};

export const proctect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });
  const [, token] = authHeader.split(" ");
  if (!token) return res.status(401).json({ message: "not a valid token" });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY?.toString()!);
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ message: "not a valid user" });
    return;
  }
};
