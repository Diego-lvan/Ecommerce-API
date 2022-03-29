import { Router } from "express";
import { getAllProducts, addProduct, getProductByID } from "../controllers/products";
import { authToken, isAdmin } from "../middlewares/auth";
import upload from "../middlewares/uploadFile";
const router = Router();

//get all products
router.get("/api/products", getAllProducts);

// get products by id
router.get("/api/products/:productID", getProductByID);

//add new product
router.post("/api/products", authToken, isAdmin, upload.single("img"), addProduct);

export default router;
