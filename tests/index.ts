import pool from "../src/config/conn";
import { validProducts } from "./utils/product";
import server from "../src/server";

beforeEach(async () => {
  await pool.query("DELETE FROM product");
  await pool.query("DELETE FROM user");
  await pool.query("DELETE FROM review");
  await pool.query("DELETE FROM sale");
  const productsSQL = validProducts.map(({ name, price, stock, brand }) => `('${name}',${price}, ${stock},'${brand}')`).join(",");
  await pool.query(`INSERT INTO product (name,price,stock,brand) VALUES  ${productsSQL}`);
});
afterEach(() => {});

afterAll((done) => {
  pool.end();
  server.close();
  done();
});
