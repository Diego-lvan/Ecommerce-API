"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRouter = exports.authRouter = void 0;
const auth_1 = __importDefault(require("./auth"));
exports.authRouter = auth_1.default;
const products_1 = __importDefault(require("./products"));
exports.productsRouter = products_1.default;
