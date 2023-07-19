import {Router} from "express";
import { getProductsList } from "../services/productUtils.js";

const realTimeProducts = Router();

realTimeProducts.get("/", (req,res)=>{
    const products = getProductsList()
    res.render("realTimeProducts", {products})
})

export default realTimeProducts;