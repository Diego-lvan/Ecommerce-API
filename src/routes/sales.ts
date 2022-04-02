import express from "express";
import { handleWebHook, createStripeSession } from "../controllers/sales";
const router = express.Router();

router.post("/api/sale", createStripeSession);

router.post("/webhook", handleWebHook);

export default router;
