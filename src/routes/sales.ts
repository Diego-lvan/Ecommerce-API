import express from "express";
import { handleWebHook, createStripeSession, getSingleSale, getSales } from "../controllers/sales";
import { authToken } from "../middlewares/auth";
const router = express.Router();

//create link to stripe
router.post("/api/sale", authToken, createStripeSession);

//handle requests from stripe
router.post("/webhook", handleWebHook);

//get single sale
router.get("/api/sale/:saleID", getSingleSale);

//get sales
router.get("/api/sale", getSales);

export default router;
