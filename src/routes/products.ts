import { Router } from "express";
const router = Router()
import products  from "../controllers/products"

router.get("/api/product",products.getAllProducts)

interface Product {
    id:number,
    name:string,
    price:number,
    description:string,
    stock:number,
    brand:string,
    color: string[]
}

export default router