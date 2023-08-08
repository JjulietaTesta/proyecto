import { Router } from "express";
import ProductsModel from "../dao/models/products.js";

const router = Router();

router.get("/", async (req, res)=>{
    const products = await ProductsModel.find({}).lean();
    res.render("home", {message: 'productos agregados', productos: products})
});

router.get("/realTimeProducts", async (req, res) =>{
    res.render("realTimeProducts", {message: 'productos en tiempo real', })
})

router.post("/agregarProducto", async (req, res)=>{
    const {title, description, code, price, stock, category, thumbnail} = req.body;
    if (!title || !description || !code || !price || !stock || !category || !thumbnail){
        return res.status(500).json({message : "Faltan datos"})
    } else {
        const newProduct = {
            title : title, 
            description : description,
            code : code,
            price : price,
            stock : +stock,
            category : category, 
            thumbnail : thumbnail
        }

        let result = await ProductsModel.insertMany([newProduct])
        return res.status(201).json({message: 'producto agregado', data: result})
    }
})



export default router;