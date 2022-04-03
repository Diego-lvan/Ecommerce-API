import express from "express";
import { handleWebHook, createStripeSession } from "../controllers/sales";
import { authToken } from "../middlewares/auth";
const router = express.Router();

router.post("/api/sale", authToken, createStripeSession);

router.post("/webhook", handleWebHook);

export default router;
