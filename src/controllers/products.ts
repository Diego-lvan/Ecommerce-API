import { Request, Response, NextFunction } from "express";

import pool from "../config/conn";
import { unlink } from "fs/promises";
import getInfo from "../utils/getInfo";
interface Product {
  id?: number;
  name: string;
  price: number;
  stock: number;
  brand: string;
  rating?: number;
}

const orderBy = ["brand", "price", "stock", "name", "rating"];

const paginationProducts = async (req: Request, res: Response, next: NextFunction) => {
  let { limit, page, maxPrice, brand, order }: any = req.query;
  limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
  page = isNaN(parseInt(page)) ? 0 : parseInt(page) - 1;
  maxPrice = isNaN(parseFloat(maxPrice)) ? null : parseInt(maxPrice);
  brand = brand ?? null;
  order = orderBy.includes(order) ? order : "productID";

  const start: number = page * limit;
  const [[[{ countRows }]]]: any = await pool.query("CALL countProducts(?,?)", [maxPrice, brand]);
  const totalPages: number = Math.ceil(countRows / limit);
  if (countRows === 0) return res.json({ error: "There is nothing here" });
  const [[results]]: any = await pool.query("CALL paginationFilterProducts(?,?,?,?,?)", [maxPrice, start, limit, brand, order]);
  const info = getInfo(page, limit, totalPages, countRows, [{ maxPrice }, { brand }, { order }], "product");
  res.json({ info, results });
};

const getProductByID = async (req: Request, res: Response) => {
  const { productID } = req.params;
  const sql = "SELECT * FROM product WHERE productID = ?";
  const [[product]]: any = await pool.query(sql, [productID]);
  res.json({ product });
};

const addProduct = async (req: Request, res: Response) => {
  let product: Product = req.body;
  const sql: string = `INSERT INTO product (name,price,stock,brand) VALUES (?,?,?,?)`;

  await pool.query(sql, Object.values(product));
  res.json({ success: true });
};

const updateImage = async (req: Request, res: Response) => {
  const path: string | undefined = req.file?.filename;
  const productID: number = req.body.productID;
  if (!path || !productID) return res.json({ success: false });
  const sql = "SELECT img FROM product WHERE productID = ?";
  const [[{ img }]]: any = await pool.query(sql, [productID]);
  if (img !== "not-found.png") unlink(`upload/${img}`);
  await pool.query("UPDATE product SET img = ? WHERE productID = ? ", [path, productID]);
  res.json({ success: true });
};

const updateProduct = async (req: Request, res: Response) => {
  const { productID, name, price, stock, brand } = req.body;
  const sql = "UPDATE product SET name = ?, price=?,stock=?,brand=? WHERE productID = ?";
  await pool.query(sql, [name, price, stock, brand, productID]);
  res.json({ success: true });
};

const deleteProduct = async (req: Request, res: Response) => {
  const productID = req.params?.productID;
  const sql = "SELECT img FROM product WHERE productID = ?";
  const [[data]]: any = await pool.query(sql, [productID]);
  if (data?.img !== "not-found.png") unlink(`upload/${data?.img}`);
  await pool.query("DELETE FROM product WHERE productID = ?", [productID]);
  res.json({ success: true });
};

export { addProduct, getProductByID, updateImage, updateProduct, deleteProduct, paginationProducts };
