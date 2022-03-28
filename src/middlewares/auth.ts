import { Request, Response, NextFunction, query } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../controllers/auth";
import pool from "../config/conn";
import bcrypt from "bcrypt";

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
  const sql = "SELECT email,pwd FROM user WHERE email = ?";
  const [exists]: any = await pool.query(sql, [user.email]);
  [req.exists] = exists;
  next();
};

const verifyCredentials = async (req: Request, res: Response, next: NextFunction) => {
  if (req.exists === undefined) return res.json({ msg: "User does not exist" });
  const hashedPwd: string = req.exists.pwd;
  const pwd: string = req.body.pwd;
  const pwdMatch = await bcrypt.compare(pwd, hashedPwd);
  if (pwdMatch) return next();
  res.json({ msg: "Password does not match" });
};

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const email: string = req.user;
  const sql = "SELECT isAdmin FROM user WHERE email = ?";
  const [[data]]: any = await pool.query(sql, [email]);
  if (data.isAdmin === 1) return next();
  res.json({ msg: "You are not an admin" });
};

export { authToken, userExists, verifyCredentials, isAdmin };
