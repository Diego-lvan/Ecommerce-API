import { Router } from "express";
import { forgotPassword, getCurrentUser, getUserByID, resetPassword, updatePwd, updateUser } from "../controllers/user";
import { authToken, isAdmin } from "../middlewares/auth";
const router = Router();

// get user by ID
router.get("/api/user/:userID", authToken, isAdmin, getUserByID);

//show current user
router.get("/api/user", authToken, getCurrentUser);

//update user
router.put("/api/user/updateUser", authToken, updateUser);

//update user password
router.patch("/api/user/updatePwd", authToken, updatePwd);

//forgot password
router.post("/api/user/forgotPassword", forgotPassword);

// reset forgot password
router.patch("/api/user/resetPassword", resetPassword);

export default router;
