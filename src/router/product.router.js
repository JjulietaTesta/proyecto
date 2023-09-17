import { Router } from "express";
import { getProductos, getProductByID, modifyProducto, deleteProducto, saveProducto } from "../controller/product.controller.js"

const router = Router()

router.get("/",getProductos)

router.get("/:pid",getProductByID)

router.put("/:pid",modifyProducto)

router.delete("/:pid",deleteProducto)

router.post("/agregarProducto",saveProducto)

export default router