import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../config/conn";
export interface User {
  pwd: string;
  email: string;
}

const loginUser = (req: Request, res: Response) => {
  const username: string = req.body.username;
  const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET!);
  res.json({ accessToken });
};

const verifyCredentials = (req: Request, res: Response): boolean => {
  const user: User = req.body;
  console.log(user);
  return true;
};

const registerUser = async (req: Request, res: Response) => {
  if (req.exists.length > 0) return res.json({ msg: "user exists" });
  const user: User = req.body;
  user.pwd = await bcrypt.hash(user.pwd, 10);
  await pool.query("INSERT INTO user (email,pwd) VALUES (?,?)", [user.email, user.pwd]);
  res.json({ email: user.email });
};

export { loginUser, registerUser };
