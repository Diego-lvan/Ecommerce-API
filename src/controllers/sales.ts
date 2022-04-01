import { Request, Response } from "express";
const addSale = async (req: Request, res: Response) => {
  const { productID, userID, amount } = req.body;
  const user = req.userID;
};
