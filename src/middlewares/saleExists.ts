import { NextFunction, Request, Response } from "express";
import pool from "../config/conn";
const saleExists = async (req: Request, res: Response, next: NextFunction) => {
  const userID: number = req.userID;
  const { productID } = req.body;
  const sql = "SELECT productID FROM sale WHERE userID = ? AND productID = ?";
  const [data]: any[] = await pool.query(sql, [userID, productID]);
  if (data.length === 0) return res.json({ error: "You have to purchase before review" });
  next();
};

export default saleExists;
