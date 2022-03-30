"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addImg = exports.getProductByID = exports.addProduct = exports.getAllProducts = void 0;
const conn_1 = __importDefault(require("../config/conn"));
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [products] = yield conn_1.default.query("SELECT * FROM product");
    res.json({ products });
});
exports.getAllProducts = getAllProducts;
const getProductByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productID } = req.params;
    const sql = "SELECT * FROM product WHERE productID = ?";
    const [[product]] = yield conn_1.default.query(sql, [productID]);
    res.json(product);
});
exports.getProductByID = getProductByID;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let product = req.body;
    const sql = `INSERT INTO product (name,price,stock,brand) VALUES (?,?,?,?)`;
    yield conn_1.default.query(sql, Object.values(product));
    res.json(product);
});
exports.addProduct = addProduct;
const addImg = (req, res) => {
    var _a;
    const path = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    const productID = req.body.productID;
    if (!path || !productID)
        return res.json({ success: false });
    conn_1.default.query("UPDATE product SET img = ? WHERE productID = ? ", [path, productID]);
    res.json({ success: true });
};
exports.addImg = addImg;
