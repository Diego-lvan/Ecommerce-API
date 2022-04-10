import { Request, Response, NextFunction, query } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../controllers/auth";
import pool from "../config/conn";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

const authToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader: string = req.headers["authorization"]!;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "unauthorized" });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, userID: any) => {
    if (err) return res.status(401).json({ msg: "unauthorized" });
    req.userID = parseInt(userID);
    next();
  });
};
const userExists = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  const sql = "SELECT email,pwd,userID FROM user WHERE email = ?";
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
  const userID: number = req.userID;
  const sql = "SELECT isAdmin FROM user WHERE userID = ?";
  const [[data]]: any = await pool.query(sql, [userID]);
  if (data?.isAdmin === 1) return next();
  res.json({ msg: "You are not an admin" });
};

export { authToken, userExists, verifyCredentials, isAdmin };
