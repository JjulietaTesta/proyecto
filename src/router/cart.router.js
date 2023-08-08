import { Router } from "express";
import ProductsModel from "../dao/models/products.js";
import cartModel from "../dao/models/carts.js";


const router = Router();


router.post("/", async (req, res) => {
  const cart = {
    products : []
  }
  let result = await cartModel.insertMany([cart])
  return res.json({message: 'carrito creado con exito', data: result})
});

router.get("/:cid", async (req, res) => {
  const {cid} = req.params
  let result = await cartModel.findById(cid)
  return res.json({message:'producto encontrado', data: result})
});

router.post("/:cid/product/:pid", async (req, res) => {
  const {cid, pid} = req.params
  let carrito = await cartModel.findById(cid)
  let producto = await ProductsModel.findById(pid)

  if (carrito){
    let productsCart = carrito.products
    if (productsCart.some((productsCart)=> productsCart.product === producto.id)){
      let producto = productsCart.find((producto)=> producto.product=== pid)
      producto.quantity++
      let result = await cartModel.findByIdAndUpdate(cid, carrito)
      return res.json({message:'producto agregado', data:result})
    } else {
       const productoEnCart = {
        product: producto.id,
        quantity: 1
       }

      carrito.products.push(productoEnCart)
      let result = await cartModel.findByIdAndUpdate(cid, carrito)
      return res.json({message: "Producto agregado al carrito", data: result})
    } 
  }  else {
    return res.json({messaage:'carrito no encontrado'})
  }
});

export default router;