import { Router } from "express";
import { getAllProducts, addProduct, getProductByID, addImg } from "../controllers/products";
import { authToken, isAdmin } from "../middlewares/auth";
import upload from "../middlewares/uploadFile";
const router = Router();

//get all products
router.get("/api/products", getAllProducts);

// get products by id
router.get("/api/products/:productID", getProductByID);

//add new product
router.post("/api/products", authToken, isAdmin, /*upload.single("img")*/ addProduct);

router.post("/api/products/uploadImg", authToken, isAdmin, upload.single("img"), addImg);

export default router;
