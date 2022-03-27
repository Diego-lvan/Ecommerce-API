import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../controllers/auth";
import pool from "../config/conn";

const authToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader: string = req.headers["authorization"]!;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, user: any) => {
    if (err) return res.status(401);
    req.user = user;
    next();
  });
};

const userExists = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = req.body;
  const [exists] = await pool.query("SELECT email FROM user WHERE email = ?", [user.email]);
  req.exists = exists;
  next();
};

export { authToken, userExists };
