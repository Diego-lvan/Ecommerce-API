import { Router } from "express";
import { body } from "express-validator";
import { addReview, deleteReview, getReviews, updateReview } from "../controllers/review";
import { authToken } from "../middlewares/auth";
import reviewExists from "../middlewares/reviewExists";
import saleExists from "../middlewares/saleExists";

const router = Router();
const reviewValidator = [
  body("productID").isInt(),
  body("title").isString().isLength({ max: 20, min: 3 }),
  body("review").isString().isLength({ max: 300, min: 1 }),
  body("rate").isInt({ min: 1, max: 5 }),
];

//productID, title, review, rate
router.post("/api/review", authToken, reviewValidator, saleExists, reviewExists, addReview);

router.delete("/api/review/:productID", authToken, deleteReview);

//get review from especific product
router.get("/api/review/:productID", getReviews);

//update review
router.put("/api/review", authToken, reviewValidator, updateReview);
export default router;
