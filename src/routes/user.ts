import { Router } from "express";
import { getCurrentUser, getUserByID, updatePwd, updateUser } from "../controllers/user";
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

export default router;
