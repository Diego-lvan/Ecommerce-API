import { Request, Response } from "express";
import pool from "../config/conn";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  brand: string;
  colors: string[];
}

const getAllProducts = async (req: Request, res: Response) => {
  const [products] = await pool.query("SELECT * FROM product");
  res.json({ products });
};

const addProduct = async (req: Request, res: Response) => {
  console.log("i pass");
  res.json("you are an admin ");
};

export { getAllProducts, addProduct };
