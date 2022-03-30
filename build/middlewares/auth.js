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
exports.isAdmin = exports.verifyCredentials = exports.userExists = exports.authToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const conn_1 = __importDefault(require("../config/conn"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ msg: "unauthorized" });
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.status(401);
        req.user = user;
        next();
    });
});
exports.authToken = authToken;
const userExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const sql = "SELECT email,pwd FROM user WHERE email = ?";
    const [exists] = yield conn_1.default.query(sql, [user.email]);
    [req.exists] = exists;
    next();
});
exports.userExists = userExists;
const verifyCredentials = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.exists === undefined)
        return res.json({ msg: "User does not exist" });
    const hashedPwd = req.exists.pwd;
    const pwd = req.body.pwd;
    const pwdMatch = yield bcrypt_1.default.compare(pwd, hashedPwd);
    if (pwdMatch)
        return next();
    res.json({ msg: "Password does not match" });
});
exports.verifyCredentials = verifyCredentials;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.user;
    const sql = "SELECT isAdmin FROM user WHERE email = ?";
    const [[data]] = yield conn_1.default.query(sql, [email]);
    if (data.isAdmin === 1)
        return next();
    res.json({ msg: "You are not an admin" });
});
exports.isAdmin = isAdmin;
