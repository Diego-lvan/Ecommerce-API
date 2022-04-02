import express from "express";
import { createStripeSession } from "../controllers/sales";
const router = express.Router();

router.post("/api/sale", createStripeSession);

export default router;
