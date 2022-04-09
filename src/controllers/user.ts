import { NextFunction, Request, Response } from "express";
import pool from "../config/conn";
import bcrypt from "bcrypt";

const getUserByID = async (req: Request, res: Response) => {
  try {
    const userID: number = parseInt(req.params.userID);
    const [[data]]: any = await pool.query("SELECT userID,email,isAdmin FROM user WHERE userID = ?", [userID]);
    res.json({ user: data });
  } catch (error) {
    res.json({ error });
  }
};

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userID: number = req.userID;
    const [[data]]: any = await pool.query("SELECT userID,email,isAdmin FROM user WHERE userID = ?", [userID]);
    res.json({ user: data });
  } catch (error) {
    res.json({ error });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userID: number = req.userID;
    const newEmail: string = req.body.newEmail;
    await pool.query("UPDATE user SET email = ? WHERE userID = ?", [newEmail, userID]);
    res.json({ success: true });
  } catch (error) {
    res.json({ error });
  }
};

const updatePwd = async (req: Request, res: Response) => {
  try {
    const userID = req.userID;
    const newPwd = req.body.newPwd;
    const oldPwd = req.body.oldPwd;
    const [[{ pwd }]]: any = await pool.query("SELECT pwd FROM user WHERE userID = ?", [userID]);
    const matches = await bcrypt.compare(oldPwd, pwd);
    if (!matches) res.json({ success: false, msg: "wrong pwd" });
    const hashedNewPwd = await bcrypt.hash(newPwd, 10);
    await pool.query("UPDATE user set pwd = ? WHERE userID = ?", [hashedNewPwd, userID]);
  } catch (error) {
    res.json({ error });
  }
};

export { getUserByID, getCurrentUser, updateUser, updatePwd };
