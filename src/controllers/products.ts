import { Request, Response } from "express";
import pool from "../config/conn";

interface Product {
  id?: number;
  name: string;
  price: number;
  stock: number;
  brand: string;
  rating?: number;
}

const getAllProducts = async (req: Request, res: Response) => {
  try {
    res.json({ info: res.info, results: res.results });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getProductByID = async (req: Request, res: Response) => {
  const { productID } = req.params;
  const sql = "SELECT * FROM product WHERE productID = ?";
  const [[product]]: any = await pool.query(sql, [productID]);
  res.json(product);
};

const addProduct = async (req: Request, res: Response) => {
  let product: Product = req.body;
  const sql: string = `INSERT INTO product (name,price,stock,brand) VALUES (?,?,?,?)`;

  await pool.query(sql, Object.values(product));
  res.json(product);
};

const addImg = (req: Request, res: Response) => {
  const path: string | undefined = req.file?.filename;
  const productID: number = req.body.productID;
  if (!path || !productID) return res.json({ success: false });
  pool.query("UPDATE product SET img = ? WHERE productID = ? ", [path, productID]);
  res.json({ success: true });
};

export { getAllProducts, addProduct, getProductByID, addImg };
