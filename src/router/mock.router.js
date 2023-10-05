import { Router } from "express";
import { mockingProduct } from "../utils.js";

const router = Router()


router.get("/", (req, res) =>{
    let products = [];
    for (let i = 0; i<=100; i++) {
        products.push(mockingProduct())
    }
    res.json({data: products})
})

export default router