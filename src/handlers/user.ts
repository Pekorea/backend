import { Request, Response } from "express";
import { db } from "src/utils/db";
import bcrypt from "bcrypt";
import { creeateJwt } from "src/modules/auth";
export const createNewUser = async (req: Request, res: Response) => {
  const user = await db.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    },
  });
  const token = creeateJwt(user);
  res.json({ token });
};

export const signIn = async (req: Request, res: Response) => {
  const user = await db.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  const isValid = bcrypt.compare(
    req.body.password,
    user?.password!.toString()!
  );
  if (!isValid) {
    res.status(401).json({ message: "email or password is incorrect" });
    return;
  }
  const token = creeateJwt(user!);
  res.json({ token });
};
