import { NextFunction, Response, Request } from "express";
import pool from "../config/conn";

const addReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.userID;
    const { productID, title, review, rate }: { productID: number; title: string; review: string; rate: number } = req.body;
    const sql = "INSERT INTO review (productID,userID,title,review,rate) VALUES(?,?,?,?,?)";
    await pool.query(sql, [productID, userID, title, review, rate]);
    res.json({ success: true });
  } catch (error) {
    res.json({ error });
  }
};

export { addReview };
