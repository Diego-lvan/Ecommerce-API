import { Request, Response, NextFunction } from "express";
import pool from "../config/conn";
import "dotenv/config";
const URL: string = process.env.URL;
const pagination = (PK: string, table: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let { limit, page }: any = req.query;
    limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
    page = isNaN(parseInt(page)) ? 0 : parseInt(page) - 1;
    const start: number = page * limit;
    const sql: string = `SELECT COUNT(${PK}) AS countRows FROM ${table}`;
    const [[{ countRows }]]: any = await pool.query(sql);
    const totalPages: number = Math.floor(countRows / limit);
    if (countRows < start + limit) return res.json({ error: "There is nothing here" });
    const [results] = await pool.query(`SELECT * FROM ${table} LIMIT ?,?`, [start, limit]);
    const info = {
      prev: page === 0 ? null : `${URL}/${table}?page=${page}&limit=${limit}`,
      count: limit,
      pages: totalPages,
      next: page + 2 > totalPages ? null : `${URL}/${table}s?page=${page + 2}&limit=${limit}`,
    };
    res.json({ info, results });
  };
};

export default pagination;
