import { Router } from "express";
import { body } from "express-validator";
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

const productValidation = [
  body("name").isString().isLength({ max: 40, min: 3 }),
  body("price").isFloat({ min: 1 }),
  body("stock").isInt({ min: 0 }),
  body("brand").isString().isLength({ max: 25 }),
];

//get products
router.get("/api/product", paginationProducts);

// get products by id
router.get("/api/product/:productID", getProductByID);

//add new product
router.post("/api/product", authToken, isAdmin, productValidation, addProduct);

//upload image
router.post("/api/product/uploadImg", authToken, isAdmin, upload.single("img"), updateImage);

//update product
router.put("/api/product", authToken, isAdmin, productValidation, body("productID").isInt(), updateProduct);

//delete prodcut
router.delete("/api/product/:productID", authToken, isAdmin, deleteProduct);
export default router;
