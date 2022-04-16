import express from "express";
import "dotenv/config";
import cors from "cors";
import { authRouter, productsRouter, salesRouter, reviewRouter, userRouter } from "./routes";
import handleErrors from "./middlewares/handleErrors";
import "./config/conn";
import path from "path";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const config = { extensions: ["png", "jpg", "svg", "jpeg"] };
app.use(express.static(path.join("upload"), config));

app.use(authRouter, productsRouter, salesRouter, reviewRouter, userRouter, handleErrors);

export default app;
