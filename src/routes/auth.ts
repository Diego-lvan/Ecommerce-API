import "dotenv/config";
import express, { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth";
import { userExists, verifyCredentials } from "../middlewares/auth";
import { body, validationResult } from "express-validator";
const router: Router = express();
const validateUserPwd = [body("email").isEmail(), body("pwd").isLength({ min: 5 })];

//login user
router.post("/api/auth/login", userExists, verifyCredentials, loginUser);

//register user
router.post("/api/auth/register", validateUserPwd, userExists, registerUser);

export default router;
