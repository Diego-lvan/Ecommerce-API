import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../config/conn";
import "dotenv";
export interface User {
  pwd: string;
  email: string;
}

const loginUser = (req: Request, res: Response) => {
  const userID: string = req.exists.userID;
  const accessToken = jwt.sign(userID, process.env.ACCESS_TOKEN_SECRET!);
  res.json({ accessToken });
};

const registerUser = async (req: Request, res: Response) => {
  if (req.exists !== undefined) return res.json({ msg: "user exists" });
  const user: User = req.body;
  user.pwd = await bcrypt.hash(user.pwd, 10);
  await pool.query("INSERT INTO user (email,pwd) VALUES (?,?)", [user.email, user.pwd]);
  res.json({ email: user.email });
};

export { loginUser, registerUser };
