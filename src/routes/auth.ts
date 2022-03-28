import "dotenv/config";
import express, { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth";
import { userExists, verifyCredentials } from "../middlewares/auth";
const router: Router = express();

//login user
router.post("/api/auth/login", userExists, verifyCredentials, loginUser);

//register user
router.post("/api/auth/register", userExists, registerUser);

export default router;
