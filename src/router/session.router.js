import { Router } from "express";

const router = Router()

router.get("/login", (req, res)=>{
    res.send("Hello world")
})

router.get("/signup", (req, res)=>{
    res.send("Hello world")
})

export default router