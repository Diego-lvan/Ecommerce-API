import supertest from "supertest";
import app from "../src/app";
import pool from "../src/config/conn";
import { Product } from "../src/controllers/products";
import { getAdminToken } from "./utils/auth";
import { getProduct, invalidProducts, validProducts } from "./utils/product";
const request = supertest(app);
let adminToken: string;
beforeEach(async () => {
  adminToken = await getAdminToken();
});

describe("GET /api/product", () => {
  // GET products
  describe("GET /api/product/?query", () => {
    test("Should respond with a 200 status code and the body should contain a 'results' array", async () => {
      const queries = ["?limit=2&page=1"];
      for (const query of queries) {
        const res = await request.get(`/api/product${query}`).send();
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.results).toBeInstanceOf(Array);
      }
    });
    test("Should respond with a 404 status code when products does not exist", async () => {
      const res = await request.get(`/api/product?maxPrice=-1`);
      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/product/:id", () => {
    test("Should respond with a 200 status code and the body contains a 'product' object", async () => {
      const product = await getProduct();
      const res = await request.get(`/api/product/${product.productID}`);
      expect(res.status).toBe(200);
      expect(res.body.product).toBeInstanceOf(Object);
    });

    test("Should respond with a 404 status code", async () => {
      const res = await request.get(`/api/product/invalidID`);
      expect(res.status).toBe(404);
    });
  });
});
// POST product
describe("POST product", () => {
  test("Should respond with 201 status code", async () => {
    const res = await request.post("/api/product").set("Authorization", adminToken).send(validProducts[0]);
    expect(res.status).toBe(201);
  });
  test("Should respond with 400 status code", async () => {
    for (const invalidProduct of invalidProducts) {
      const res = await request.post("/api/product").set("Authorization", adminToken).send(invalidProduct);
      expect(res.status).toBe(400);
    }
  });

  test("Should respond with 401 statuc code when sending invalid admin token", async () => {
    const res = await request.post("/api/product").set("Authorization", "").send(validProducts[0]);
    expect(res.status).toBe(401);
  });
});
//PUT product
describe("PUT proudct", () => {
  test("Should respond with 200 status code and should update the product", async () => {
    const product: Product = await getProduct();
    const newProduct: Product = { ...validProducts[1], name: "Test", productID: product.productID };
    const res = await request.put("/api/product").set("Authorization", adminToken).send(newProduct);

    const updatedProduct: Product = await getProduct();
    expect(res.status).toBe(200);
    expect(updatedProduct.name).toBe(newProduct.name);
  });

  test("Should respond with 400 status code and should not update the product when a invalid product is sent", async () => {
    const [products]: any[] = await pool.query(`SELECT productID FROM product limit ${invalidProducts.length}`);
    for (const [i, product] of products.entries()) {
      const newInvalidProduct = { ...invalidProducts[i], productID: product.productID };
      const res = await request.put("/api/product").set("Authorization", adminToken).send(newInvalidProduct);
      expect(res.status).toBe(400);
    }
  });
  test("Should respond with 401 status code when sending a invalid admin token", async () => {
    const product: Product = await getProduct();
    const newProduct: Product = { ...validProducts[1], productID: product.productID, name: "Test" };
    const res = await request.put("/api/product").set("Authorization", "").send(newProduct);
    expect(res.status).toBe(401);
  });
});

// DELETE product
describe("DELETE product", () => {
  test("Should respond with 200 status code and delete the product", async () => {
    const product: Product = await getProduct();
    const res = await request.delete(`/api/product/${product.productID}`).set("Authorization", adminToken);
    const [productDeleted]: any = await pool.query(`SELECT productID FROM product WHERE productID = ${product.productID}`);
    expect(productDeleted).toHaveLength(0);
    expect(res.status).toBe(200);
  });

  test("Should respond with a 200 status code when the product does not exist", async () => {
    const res = await request.delete("/api/product/-1").set("Authorization", adminToken).send();
    expect(res.status).toBe(200);
  });
  test("Should respond with 401 status code when sending a invalid admin token", async () => {
    const res = await request.delete("/api/product/1").set("Authorization", "");
    expect(res.status).toBe(401);
  });
});
