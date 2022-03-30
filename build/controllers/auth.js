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
exports.registerUser = exports.loginUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const conn_1 = __importDefault(require("../config/conn"));
require("dotenv");
const loginUser = (req, res) => {
    const email = req.body.email;
    const accessToken = jsonwebtoken_1.default.sign(email, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken });
};
exports.loginUser = loginUser;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.exists !== undefined)
        return res.json({ msg: "user exists" });
    const user = req.body;
    user.pwd = yield bcrypt_1.default.hash(user.pwd, 10);
    yield conn_1.default.query("INSERT INTO user (email,pwd) VALUES (?,?)", [user.email, user.pwd]);
    res.json({ email: user.email });
});
exports.registerUser = registerUser;
