import { Router } from "express";
import { getAllProducts, addProduct } from "../controllers/products";
import { authToken, isAdmin } from "../middlewares/auth";
import upload from "../middlewares/uploadFile";
const router = Router();

//get all products
router.get("/api/products", getAllProducts);

//add new product
router.post("/api/products", upload.single("img"), authToken, isAdmin, addProduct);

export default router;
