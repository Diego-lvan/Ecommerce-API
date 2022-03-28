import express from "express";
import "dotenv/config";
import cors from "cors";
import { authRouter, productsRouter } from "./routes";
import "./config/conn";
const app = express();
const PORT = process.env.PORT! || 5000;

app.use(cors());
app.use(express.json());

app.use(authRouter, productsRouter);

app.listen(PORT || 5000, () => {
  console.log(`listening in port ${PORT || 5000}`);
});
