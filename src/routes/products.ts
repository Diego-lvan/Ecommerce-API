import { Router } from "express";
import { getProducts, addProduct, getProductByID, addImg } from "../controllers/products";
import { authToken, isAdmin } from "../middlewares/auth";
import pagination from "../middlewares/pagination";
import upload from "../middlewares/uploadFile";
const router = Router();

//get products
router.get("/api/product", pagination("productID", "product"), getProducts);

// get products by id
router.get("/api/product/:productID", getProductByID);

//add new product
router.post("/api/product", authToken, isAdmin, /*upload.single("img")*/ addProduct);

router.post("/api/product/uploadImg", authToken, isAdmin, upload.single("img"), addImg);

export default router;
