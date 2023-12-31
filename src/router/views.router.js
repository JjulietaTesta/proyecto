import { Router } from "express";
import ProductsModel from "../dao/mongo/models/products.js";
import cartModel from "../dao/mongo/models/carts.js";



const router = Router()

router.get("/",async (req,res)=>{
    const {limit = 10, page = 1, sort, query} = req.query
    const {docs,hasPrevPage,hasNextPage,nextPage,prevPage} = await ProductsModel.paginate(query ? {category: query} : {},{limit, page, lean: true, sort: sort ? {price:1} : {price:-1}})
    res.render("home",{title: "Productos", 
    productos: docs,  
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    limit,
    sort,
    query,
    script: "agregarProductos.js"
})
})

router.get("/realTimeProducts",(req,res)=>{
    res.render("realTimeProducts",{title: "Productos en tiempo real", script: "index.js"})
})

router.get("/carts/:cid",async(req,res)=>{
    const { cid } = req.params;
    try {
        let carrito = await cartModel.findOne({_id: cid }).lean()
        if (carrito) {
            let productos = carrito.products;
            if(productos.length === 0){
                res.send("El carrito está vacio")
            }else{
                res.render("carrito", { title: "Carrito", productos});
            }
        } else {
            res.send("Carrito no encontrado");
        }
    } catch (err) { 
        console.log(err); 
        res.send("Error al cargar el carrito");
    }
})




export default router 