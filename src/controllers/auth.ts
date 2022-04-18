import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../config/conn";
import "dotenv";
export interface User {
  pwd: string;
  email: string;
}

const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const userID: string = req.exists.userID;
  try {
    const accessToken = jwt.sign(userID, process.env.ACCESS_TOKEN_SECRET!);
    res.json({ accessToken: `Bearer ${accessToken}` });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  if (req.exists !== undefined) return res.json({ msg: "user exists" });
  const user: User = req.body;
  try {
    user.pwd = await bcrypt.hash(user.pwd, 10);
    await pool.query("INSERT INTO user (email,pwd) VALUES (?,?)", [user.email, user.pwd]);
    res.status(201).json({ email: user.email });
  } catch (error) {
    next(error);
  }
};

export { loginUser, registerUser };
