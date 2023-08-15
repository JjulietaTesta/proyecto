import { Router } from "express";
import ProductsModel from "../dao/models/products.js";
import cartModel from "../dao/models/carts.js";


const router = Router();

router.get("/", async (req, res)=>{
    const {limit = 10, page = 1, sort, query} = req.query
    const {docs, hasPrevPage, hasNextPage, prevPage, nextPage} = await ProductsModel.paginate(query ? {category: query} : {},{limit, page, lean: true, sort: sort ? {price:1} : {price:-1}})
    res.render("home", { title: "products",
    productos: docs,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    limit,
    sort,
    query,
    script: "agregarProductos.js"})
});

router.get("/realTimeProducts", async (req, res) =>{
    res.render("realTimeProducts", {message: 'productos en tiempo real', script: "index.js"})
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

router.get("/carts/:cid", async (req,res)=>{
    const {cid} = req.params
    try {
        let carrito = await cartModel.findOne({_id:cid}).lean()
        if (carrito){
            let productos = carrito.products
            res.render("carrito", { title: "Carrito", productos: productos });
        } else {
            res.send('carrito no encontrado')
        }
    } catch (err){
        res.send("algo salio mal")
    }
})



export default router;