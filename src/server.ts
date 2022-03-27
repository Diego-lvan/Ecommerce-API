import express from "express";
import "dotenv/config";
import cors from "cors";
import authRouter from "./routes/auth"
import productsRouter from "./routes/products"
import "./config/conn"
const app = express()
const PORT = process.env.PORT!  || 5000   

app.use(cors())
app.use(express.json())

app.use(authRouter)
app.use(productsRouter)

app.listen(PORT,() => {
    console.log(`listening in port ${PORT}`)
})