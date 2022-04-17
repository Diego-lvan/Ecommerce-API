import pool from "../../src/config/conn";
import { Product } from "../../src/controllers/products";
const getProduct = async (): Promise<Product> => {
  const [result]: any = await pool.query("SELECT * FROM product");
  return result[0];
};

const validProducts = [
  {
    name: "Iphone 13",
    price: 200000,
    stock: 12,
    brand: "Apple",
  },
  {
    name: "Huawei P40",
    price: 100000,
    stock: 13,
    brand: "Huawei",
  },
];
const invalidProducts = [
  {
    name: undefined,
    price: 200000,
    stock: 12,
    brand: "Apple",
  },
  {
    name: "Huawei P40",
    price: -100000,
    stock: -13,
    brand: "Huawei",
  },
  {
    name: "",
    price: 200000,
    stock: 12,
    brand: "Apple",
  },
  {
    name: "",
    price: 100000,
    stock: 13,
    brand: "",
  },
];

export { getProduct, validProducts, invalidProducts };
