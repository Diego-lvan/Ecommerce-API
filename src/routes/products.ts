import { Router } from "express";
import {
  addProduct,
  getProductByID,
  updateImage,
  updateProduct,
} from "../controllers/products";
import { authToken, isAdmin } from "../middlewares/auth";
import pagination from "../middlewares/pagination";
import upload from "../middlewares/uploadFile";
const router = Router();

//get products
router.get("/api/product", pagination("productID", "product"));

// get products by id
router.get("/api/product/:productID", getProductByID);

//add new product
router.post("/api/product", authToken, isAdmin, addProduct);

//upload image
router.post("/api/product/uploadImg", authToken, isAdmin, upload.single("img"), updateImage);

//update product
router.put("/api/product", updateProduct);

export default router;
