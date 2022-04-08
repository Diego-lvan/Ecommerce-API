import { Router } from "express";
import { addReview } from "../controllers/review";
import { authToken } from "../middlewares/auth";
import reviewExists from "../middlewares/reviewExists";
import saleExists from "../middlewares/saleExists";

const router = Router();

router.post("/api/review", authToken, saleExists, reviewExists, addReview);

export default router;
