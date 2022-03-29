import { Request, Response } from "express";
import pool from "../config/conn";

interface Product {
  id?: number;
  name: string;
  price: string;
  stock: string;
  brand: string;
  colors: string[];
  rating?: number;
}

const getAllProducts = async (req: Request, res: Response) => {
  const [products] = await pool.query("SELECT * FROM product");
  res.json({ products });
};

const getProductByID = async (req: Request, res: Response) => {
  const { productID } = req.params;
  const sql = "SELECT * FROM product WHERE productID = ?";
  const [[product]]: any = await pool.query(sql, [productID]);
  res.json(product);
};

const addProduct = async (req: Request, res: Response) => {
  let product: Product = req.body;
  console.log(req.body);
  const sql: string = `INSERT INTO product (name,price,stock,brand,colors,img) VALUES (?,?,?,?,?,?)`;
  await pool.query(sql, [
    product.name,
    parseFloat(product.price),
    parseInt(product.stock),
    product.brand,
    product.colors,
    req.file?.path,
  ]);
  res.json(product);
};

export { getAllProducts, addProduct, getProductByID };
