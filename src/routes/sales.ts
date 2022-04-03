import express from "express";
import { handleWebHook, createStripeSession, getSingleSale } from "../controllers/sales";
import { authToken } from "../middlewares/auth";
const router = express.Router();

//create link to stripe
router.post("/api/sale", authToken, createStripeSession);

//handle requests from stripe
router.post("/webhook", handleWebHook);

//get single sale
router.get("/api/sale/:saleID", getSingleSale);

export default router;
