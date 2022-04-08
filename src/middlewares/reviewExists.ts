import { NextFunction, Request, Response } from "express";
import pool from "../config/conn";
const reviewExists = async (req: Request, res: Response, next: NextFunction) => {
  const userID: number = req.userID;
  const { productID } = req.body;
  const sql = "SELECT userID FROM review WHERE userID = ? AND productID = ?";
  const [data]: any[] = await pool.query(sql, [userID, productID]);
  if (data.length > 0) return res.json({ error: "Review already created" });
  next();
};

export default reviewExists;
