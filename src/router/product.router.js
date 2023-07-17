import express from 'express';
import { Router } from "express";
import { ProductManager } from "../classes/productManager.js";

const router = Router();
const productManager = new ProductManager('productos.json');
let productos = [];

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get ("/",async (req,res)=>{

    const { limit } = req.query;

    try {
        let response = await productManager.getProducts();
        if (limit) {
            let tempArray = response.filter((dat, index) => index < limit )
            res.json(tempArray)
        } else {
            res.json(response)
        }
    
    }
    catch (err) {
        console.log(err)
    }

});


router.get ("/:pid",async (req,res)=>{
    const { pid } = req.params
    let id = await productManager.getProductById(parseInt(pid))

    if (id) {
        res.json(id)
    } else {
        res.json ({
            mensaje: "no encontramos el producto"
        })
    }

})

router.post ("/", async (req, res)=>{
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;
    const product = {};
    if ( !title || !description || !code || !price || !stock || !category){
        res.json ({message: "faltan datos"})
    } else {
        product.title = title,
        product.description = description,
        product.code = code, 
        product.price = price,
        product.status = !status || typeof status !== "boolean" ? true : status, 
        product.stock = stock, 
        product. category = category
        product.thumbnail = !thumbnail ? "" : thumbnail
    }

    try {
        const response = await productManager.addProduct(product);
        res.json({message: "producto agregado", data: response});
    } catch (error){
        console.log (error);
        res.status(500).json({message:"error interno del servidor"});
    }

})

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const {price} = req.body;
    const productTemp = {};
    let product = await productManager.getProductById(parseInt(pid));
  
    if (product) {
      if (
        (!price)
      ) {
        res.json({ message: "faltan datos" });
      }
      productTemp.price = price;

      let result = await productManager.updateProductById(
        parseInt(pid),
        productTemp
      );
  
      res.json({ message: "producto actualizado", data: result });
    } else {
      res.json({
        message: "el producto solicitado no existe, no se puede actualizar",
      });
    }
  });

router.delete ("/:pid", async (req,res)=>{
    const {pid} = req.params;
    let product = await productManager.getProductById(parseInt(pid));
    if (!product){
        res.json({message:"el producto no existe, no se puede eliminar"})
    } else {
        let result = await productManager.deleteProductById(parseInt(pid));
        res.json({message: "producto eliminado", data: result})
    }
})

export default router;