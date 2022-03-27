import { Request,Response } from "express"
import pool from "../config/conn"

const getAllProducts = async(req:Request,res:Response) => {
const [data] = await pool.query("SELECT * FROM product")
    console.log(data)
}
export default {getAllProducts}


