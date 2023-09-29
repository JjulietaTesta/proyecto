import {CARTS_DAO} from "../dao/index.js"
import ProductsModel from "../dao/mongo/models/products.js";
import { ProductsRepository } from "../dao/repository/products.repository.js";
import { PRODUCTS_DAO } from "../dao/index.js";

const productsService = new ProductsRepository(PRODUCTS_DAO)

async function showProducts(req,res){
    try {
        if (process.env.PERSISTENCE === "MONGO"){
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
                script: "home.js", 
                style: "home.css",
                nombre: req.user.user.first_name,
                apellido: req.user.user.last_name,
                email: req.user.user.email,
                rol: req.user.user.role,
                idCart: req.user.user.cart,
                PORT: process.env.PORT
            })
        } else {
            res.render("home",{
                title: "Productos", 
                script: "home.js",    
                style: "home.css",
                fullname: req.user.user.fullname,
                email: req.user.user.email,
                rol: req.user.user.role, 
                idCart: req.user.user.cart, 
                productos: await productsService.getProducts(req,res),
                PORT: process.env.PORT,
                MONGO: process.env.PERSISTENCE === "MONGO"
               })
        }
    } catch (err) {
        console.log(err)
    }
}

async function realTimeProducts(req,res){
    try {
        res.render("real time products", {title: "productos", script: "realtime"})
    } catch (err){
        console.log(err)
    }
}


async function showCart (req,res){
    try{
        const {cid} = req.params
        try { 
            let carrito = await CARTS_DAO.getCartById(cid)
            if (carrito){
                let productos = carrito.products.map(p=>p.product)
                if(productos.length === 0){
                    res.send("carrito vacio")
                } else {
                    res.render("carrito", {title: "carrito", productos, script: "carrito.js",MONGO: process.env.PERSISTENCE === "MONGO", purchaser: req.user.user.email, idC: req.user.user.cart})
                }
            } else {
                res.send("el carrito no existe")
            }
        } catch (err){
            res.send("se produjo un error")
        }
    } catch (err){
        console.log(err)
    }
}

export {showProducts, realTimeProducts, showCart}