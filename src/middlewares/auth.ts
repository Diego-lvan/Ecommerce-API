import { Request,Response,NextFunction } from "express"
import jwt from "jsonwebtoken"


import "dotenv/config" 
const authToken = async (req:Request,res:Response, next:NextFunction) => {
    const authHeader:string = req.headers["authorization"]!
    const token = authHeader && authHeader.split(" ")[1]
    if(!token) return res.status(401)
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!,(err:any,user:any) => {
        if(err) return res.status(401)
        req.user = user
        next() 
    })
    
}

export default authToken