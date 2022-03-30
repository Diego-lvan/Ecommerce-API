"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middlewares/auth");
const router = (0, express_1.default)();
//login user
router.post("/api/auth/login", auth_2.userExists, auth_2.verifyCredentials, auth_1.loginUser);
//register user
router.post("/api/auth/register", auth_2.userExists, auth_1.registerUser);
exports.default = router;
