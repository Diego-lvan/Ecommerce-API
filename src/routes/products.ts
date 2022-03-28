import { Router } from "express";
import { getAllProducts, addProduct } from "../controllers/products";
import { authToken, isAdmin } from "../middlewares/auth";
const router = Router();

//get all products
router.get("/api/products", getAllProducts);

//add new product
router.post("/api/products", authToken, isAdmin, addProduct);

export default router;
