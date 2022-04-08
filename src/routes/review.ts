import { Router } from "express";
import { addReview, deleteReview, getReviews } from "../controllers/review";
import { authToken } from "../middlewares/auth";
import reviewExists from "../middlewares/reviewExists";
import saleExists from "../middlewares/saleExists";

const router = Router();

router.post("/api/review", authToken, saleExists, reviewExists, addReview);

router.delete("/api/review/:productID", authToken, deleteReview);

//get review from especific product
router.get("/api/review/:productID", getReviews);
export default router;
