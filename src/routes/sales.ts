import express from "express";
import { handleWebHook, createStripeSession, getSingleSale, getSales, getMySales } from "../controllers/sales";
import { authToken, isAdmin } from "../middlewares/auth";
const router = express.Router();

//create link to stripe
router.post("/api/sale", authToken, createStripeSession);

//handle requests from stripe
router.post("/webhook", handleWebHook);

//get current user orders
router.get("/api/sale/mySales", authToken, getMySales);

//get single sale
router.get("/api/sale/:saleID", authToken, isAdmin, getSingleSale);

//get sales
router.get("/api/sale", authToken, isAdmin, getSales);

export default router;
