import { Router } from "express";
import cartModel from "../dao/models/carts.js";
import ProductsModel from "../dao/models/products.js";


const router = Router();


router.post("/", async (req, res) => {
  const carrito = {
    products : []
  }

  let result = await cartModel.insertMany([carrito])
  return res.json({message : "Carrito creado correctamente", data: result})
});

router.get("/:cid", async (req, res) => {
  const {cid} = req.params
  let result = await cartModel.findOne({_id: cid})
  return res.json({message: "Carrito seleccionado", data: result})
});

router.post("/:cid/products/:pid", async (req, res) => {
  const {cid, pid} = req.params
  let carrito = await cartModel.findOne({_id:cid})
  
  if (carrito){
  const productoEnCarrito = carrito.products.find(producto =>producto.product.id === pid)
  
  if (productoEnCarrito){
    productoEnCarrito.quantity++
  } else {
    const producto = await ProductsModel.findById(pid)
    carrito.products.push({
      product: producto._id,
      quantity : 1
    });
  }

  const result = await carrito.save()
  return res.json({message: "producto agregado", data:result})
} else {
  return res.status(404).json({ message: "Carrito no encontrado" });
}
});


router.delete("/:cid/products/:pid", async (req,res)=>{
  const {cid, pid} = req.params
  let carrito = await cartModel.findOne({_id:cid})
  let productos = carrito.products
  let producto = productos.findIndex((producto) => producto.product.id === pid)
  if (producto !== -1) {
    productos.splice(producto,1)
    let result = await cartModel.findByIdAndUpdate(cid,carrito)
    return res.json({message: "Producto eleminado correctamente del carrito", data: result})
  }else{
    return res.status(404).json({message: "Producto no encontrado"})
  }
})


router.put("/:cid", async (req,res)=>{
  const {cid} = req.params
  const {data} = req.body
  let carrito = await cartModel.findOne({_id: cid})
  carrito.products = data
  let result = await cartModel.findByIdAndUpdate(cid, carrito)
  return res.json({message:"se actualizo el carrito", data:result})
})



router.put("/:cid/products/:pid", async(req, res) =>{
  const {cid, pid} = req.params
  const {cantidad} = req.body
  let carrito = await cartModel.findOne({_id: cid})
  let productos = carrito.products
  let producto = productos.findIndex((producto)=> producto.product.id === pid)
  if(producto !== -1) {
    productos [producto].product.quantity = cantidad
    let result = await cartModel.findByIdAndUpdate(cid,carrito)
    return res.json({message: "carrito actualizado", data: result})
  } else {
    return res.status(404).json({message: "Producto no encontrado"})
  }
})

router.delete ("/:cid", async (req, res) =>{
  const {cid} = req.params
  let carrito = await cartModel.findById(cid)
  carrito.products = []
  let result = await cartModel.findByIdAndUpdate(cid, carrito)
  return res.json({message: "Carrito vacio", data: result})
})

export default router;