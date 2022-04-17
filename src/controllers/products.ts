import { Request, Response, NextFunction } from "express";

import pool from "../config/conn";
import { unlink } from "fs/promises";
import getInfo from "../utils/getInfo";
import { validationResult } from "express-validator";
export interface Product {
  productID?: number;
  name: string;
  price: number;
  stock: number;
  brand: string;
  rating?: number;
  enoughStock?: number;
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
  try {
    const [[[{ countRows }]]]: any = await pool.query("CALL countProducts(?,?)", [maxPrice, brand]);
    const totalPages: number = Math.ceil(countRows / limit);
    if (countRows === 0) return res.status(404).json({ error: "There is nothing here" });
    const [[results]]: any = await pool.query("CALL paginationFilterProducts(?,?,?,?,?)", [maxPrice, start, limit, brand, order]);
    const info = getInfo(page, limit, totalPages, countRows, [{ maxPrice }, { brand }, { order }], "product");
    res.json({ info, results });
  } catch (error) {
    next(error);
  }
};

const getProductByID = async (req: Request, res: Response, next: NextFunction) => {
  const { productID } = req.params;
  const sql = "SELECT * FROM product WHERE productID = ?";
  try {
    const [[product]]: any = await pool.query(sql, [productID]);
    if (!product) return res.sendStatus(404);
    res.json({ product });
  } catch (error) {
    next(error);
  }
};

const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  let product: Product = req.body;
  try {
    const sql: string = `INSERT INTO product (name,price,stock,brand) VALUES (?,?,?,?)`;
    await pool.query(sql, Object.values(product));
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

const updateImage = async (req: Request, res: Response, next: NextFunction) => {
  const path: string | undefined = req.file?.filename;
  const productID: number = req.body.productID;
  if (!path || !productID) return res.json({ success: false });
  const sql = "SELECT img FROM product WHERE productID = ?";
  const [[{ img }]]: any = await pool.query(sql, [productID]);
  if (img !== "not-found.png") unlink(`upload/${img}`);
  try {
    await pool.query("UPDATE product SET img = ? WHERE productID = ? ", [path, productID]);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  const { productID, name, price, stock, brand } = req.body;
  const sql = "UPDATE product SET name = ?, price=?,stock=?,brand=? WHERE productID = ?";
  try {
    await pool.query(sql, [name, price, stock, brand, productID]);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const productID = req.params?.productID;
  try {
    const sql = "SELECT img FROM product WHERE productID = ?";
    const [[data]]: any = await pool.query(sql, [productID]);
    if (data?.img === undefined) return res.json({ success: true });
    if (data?.img !== "not-found.png") unlink(`upload/${data?.img}`);
    await pool.query("DELETE FROM product WHERE productID = ?", [productID]);
    res.json({ success: true });
  } catch (error) {
    next();
  }
};

export { addProduct, getProductByID, updateImage, updateProduct, deleteProduct, paginationProducts };
