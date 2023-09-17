import { Router } from "express";
import { crearCarrito, getCarritoById, saveProductInCart, updateCarrito, updateQuantityProductsCarrito, deleteProductsCarrito, deleteProductCarrito} from "../controller/carrito.controller.js"

const router = Router()

router.post("/",crearCarrito)

router.get("/:cid",getCarritoById)

router.post("/:cid/product/:pid",saveProductInCart)

router.delete("/:cid/products/:pid",deleteProductCarrito)

router.put("/:cid",updateCarrito)

router.put("/:cid/products/:pid",updateQuantityProductsCarrito)

router.delete("/:cid",deleteProductsCarrito)

export default router