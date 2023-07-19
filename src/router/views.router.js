import express from "express";

import { ProductManager } from "../classes/productManager.js";
import { io } from "../app.js";

const productosManagerV1 = new ProductManager ("./productos.json");
const router = express.Router();

router.get ("/products", (req, res)=>{
    let products = productosManagerV1.getProducts();
    res.render("home", {products});
});

router.get ("/realTimeProducts", (req, res)=>{
    const products = productosManagerV1.getProducts();


    io.on ("connection", socket =>{
        console.log ("Nuevo cliente conectado", socket)
        socket.emit ("connection", {products})
    })

    res.render ("realTimeProducts", products)
});

export default router;