import { PRODUCTS_DAO } from "../dao/index.js"
import { ProductsRepository } from "../dao/repository/products.repository.js"
import { generateUserErrorInfo } from "../services/errors/info.js"
import CustomError from "../services/errors/customErr.js"
import Eerrors from "../services/errors/enum.js"
import { LOGGER } from "../dao/index.js"

const productsService = new ProductsRepository(PRODUCTS_DAO)

async function getProductos(req,res){
    req.logger = LOGGER
    try{
       const products = await productsService.getProducts(req,res)
       res.send(products)
    }catch(err){
        const error = CustomError.createError({
            name: "Products Error",
            message: "Error get products",
            cause: err,
            code: Eerrors.DB_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({status: "error", error})
    }
    
}

async function getProductByID(req,res){
    req.logger = LOGGER
    try{
        const {pid} = req.params
        const producto = await productsService.getProductById(pid)
        res.json({message: "Producto seleccionado", producto : producto})
    }catch(err){
        const error = CustomError.createError({
            name: "Product Error",
            message: "Error get product",
            cause: err,
            code: Eerrors.DB_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({status: "error", error})
    }
}

async function modifyProducto(req,res){
    req.logger = LOGGER
    try{
    const {pid} = req.params
    const {title,description,code,price,stock,category,thumbnail} = req.body
    if(!title || !description || !code || !price || !stock || !category || !thumbnail){
        const error = CustomError.createError({
            name: "Faltan datos",
            message: "Invalid types",
            cause: generateUserErrorInfo({title,description,code,price,stock,category,thumbnail}),
            code: Eerrors.INVALID_TYPES_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({status: "error", error})
    }else{
        const producto = {
         title : title,
         description: description,
         code : code,
         price : +price,
         status : true,
         stock : +stock,
         category : category,
         thumbnail : thumbnail
        }
        const data = await productsService.modifyProduct(producto,pid)
        res.json({message : "Producto modificado correctamente", data})
    }
    }catch(err){
        const error = CustomError.createError({
            name: "Products Error",
            message: "Error modify product",
            cause: err,
            code: Eerrors.DB_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({status: "error", error})
    }
    
}

async function deleteProducto(req,res){
    req.logger = LOGGER
    try{
    const {pid} = req.params
    const data = await PRODUCTS_DAO.deleteProduct(pid)
    res.send(data)
    }catch(err){
        const error = CustomError.createError({
            name: "Products Error",
            message: "Error delete product",
            cause: err,
            code: Eerrors.DB_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({status: "error", error})
    }
    
}

async function saveProducto(req,res){
    req.logger = LOGGER
    try{
    const {title,description,code,price,stock,category,thumbnail} = req.body
    if(!title || !description || !code || !price || !stock || !category || !thumbnail){
        const error = CustomError.createError({
            name: "Faltan datos",
            message: "Invalid types",
            cause: generateUserErrorInfo({title,description,code,price,stock,category,thumbnail}),
            code: Eerrors.INVALID_TYPES_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({status: "error", error})
    }else{
        const productoNuevo = {
            title,
            description,
            code,
            price : +price,
            status : true,
            stock : +stock,
            category,
            thumbnail,
            quantity : 1,
            owner : owner
        }
        console.log(productoNuevo)
        const data = await productsService.saveProduct(productoNuevo)
        res.status(201).json({message: "Producto agregado exitosamente", status: data})
    }
    }catch(err){
        const error = CustomError.generateError({
            name: "Products Error",
            message: "Error save product",
            cause: err,
            code: Eerrors.DB_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({status: "error", error})
    }
}

async function modifyStockProduct(req,res){
    req.logger = LOGGER
    const {pid} = req.params
    try{
      const response = await productsService.modifyStockProduct(pid)
      res.json({status: "Success", response}) 
    }catch(err){
      const error = CustomError.createError({
          name: "Products Error",
          message: "Error modify stock product",
          cause: err,
          code: Eerrors.DB_ERROR
      })
      req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
      res.json({status: "error", error})
    }
  }

export { getProductos, getProductByID, modifyProducto, deleteProducto, saveProducto, modifyStockProduct }