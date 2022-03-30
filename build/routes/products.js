"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = require("../controllers/products");
const auth_1 = require("../middlewares/auth");
const uploadFile_1 = __importDefault(require("../middlewares/uploadFile"));
const router = (0, express_1.Router)();
//get all products
router.get("/api/products", products_1.getAllProducts);
// get products by id
router.get("/api/products/:productID", products_1.getProductByID);
//add new product
router.post("/api/products", auth_1.authToken, auth_1.isAdmin, /*upload.single("img")*/ products_1.addProduct);
router.post("/api/products/uploadImg", auth_1.authToken, auth_1.isAdmin, uploadFile_1.default.single("img"), products_1.addImg);
exports.default = router;
