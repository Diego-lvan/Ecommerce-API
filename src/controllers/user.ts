import { NextFunction, Request, Response } from "express";
import pool from "../config/conn";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

interface JwtPayload {
  userID: number;
}

const JWT_SECRET: string = process.env.ACCESS_TOKEN_SECRET;
const getUserByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID: number = parseInt(req.params.userID);
    const [[data]]: any = await pool.query("SELECT userID,email,isAdmin FROM user WHERE userID = ?", [userID]);
    if (!data) return res.status(404).json({ error: "not found" });
    res.json({ user: data });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID: number = req.userID;
    const [[data]]: any = await pool.query("SELECT userID,email,isAdmin FROM user WHERE userID = ?", [userID]);
    res.json({ user: data });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID: number = req.userID;
    const newEmail: string = req.body.newEmail;
    await pool.query("UPDATE user SET email = ? WHERE userID = ?", [newEmail, userID]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const updatePwd = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.userID;
    const newPwd = req.body.newPwd;
    const oldPwd = req.body.oldPwd;
    const [[{ pwd }]]: any = await pool.query("SELECT pwd FROM user WHERE userID = ?", [userID]);
    const matches = await bcrypt.compare(oldPwd, pwd);
    if (!matches) return res.status(401).json({ msg: "wrong pwd" });
    const hashedNewPwd = await bcrypt.hash(newPwd, 10);
    await pool.query("UPDATE user set pwd = ? WHERE userID = ?", [hashedNewPwd, userID]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const baseURL = req.body.baseURL;
  const [[user]]: any = await pool.query("SELECT pwd,userID FROM user WHERE email = ?", [email]);
  if (!user) return res.json({ error: "User does not exist" });
  const { userID, pwd } = user;
  const secret = JWT_SECRET + pwd;
  const payload = { email: user.email, userID: userID };
  const token = jwt.sign(payload, secret, { expiresIn: "3m" });

  const link = `${baseURL}/resetPassword/${userID}/${token}`;
  const trasporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.EMAIL_ADRESS,
      pass: process.env.EMAIL_PWD,
    },
  });
  const options = {
    from: process.env.EMAIL_ADRESS,
    to: email,
    subject: "Reset your password",
    text: `${link}`,
  };
  trasporter.sendMail(options, (err, info) => {
    if (err) return res.json({ err });
    res.json({ link });
  });
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const userID: number = parseInt(req.body.userID);
  const token: string = req.body.token;
  const newPwd: string = req.body.newPwd;
  const sql = "SELECT pwd FROM user WHERE userID = ?";
  const [[user]]: any = await pool.query(sql, [userID]);
  const oldPwd = user?.pwd;
  const secret = JWT_SECRET + oldPwd;

  try {
    const payload: JwtPayload = (await jwt.verify(token, secret)) as JwtPayload;
    if (userID !== payload.userID) return res.json({ error: "Wrong user id" });
    const hashedNewPwd = await bcrypt.hash(newPwd, 10);
    await pool.query("UPDATE user SET pwd = ? WHERE userID = ?", [hashedNewPwd, userID]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
export { getUserByID, getCurrentUser, updateUser, updatePwd, forgotPassword, resetPassword };
