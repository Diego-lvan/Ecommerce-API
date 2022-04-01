import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProductByID,
  paginationProducts,
  updateImage,
  updateProduct,
} from "../controllers/products";
import { authToken, isAdmin } from "../middlewares/auth";
import upload from "../middlewares/uploadFile";
const router = Router();

//get products
router.get("/api/product", paginationProducts);

// get products by id
router.get("/api/product/:productID", getProductByID);

//add new product
router.post("/api/product", authToken, isAdmin, addProduct);

//upload image
router.post("/api/product/uploadImg", authToken, isAdmin, upload.single("img"), updateImage);

//update product
router.put("/api/product", authToken, isAdmin, updateProduct);

//delete prodcut
router.delete("/api/product/:productID", authToken, isAdmin, deleteProduct);
export default router;
