import "dotenv/config"
import express,{Router, Request,Response} from "express";
import jwt from "jsonwebtoken"
import authToken from "../middlewares/auth";

const router:Router = express()

router.post("/login", (req:Request,res:Response) => {
    const {username} = req.body
    const accessToken = jwt.sign(username,process.env.ACCESS_TOKEN_SECRET!)
    res.json({accessToken})

})

router.get("/test",authToken,(req:Request,res:Response) => {
    console.log(req.user)
    res.json({user:req.user})
})


export default router