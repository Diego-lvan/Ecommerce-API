import "dotenv/config";
import express, { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loginUser, registerUser } from "../controllers/auth";
import { userExists } from "../middlewares/auth";
const router: Router = express();

router.post("/api/auth/login", loginUser);

router.post("/api/auth/register", userExists, registerUser);

export default router;
