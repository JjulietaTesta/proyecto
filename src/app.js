import { engine } from "express-handlebars";
import express from 'express';
import { __dirname } from "./utils.js";
import viewsRoute from "./router/views.router.js";
import ProductsModel from "./dao/models/products.js";
import productRouter from "./router/product.router.js";
import cartRouter from "./router/cart.router.js";
import realTimeProducts from "./router/realTimeProduct.router.js";
import { Server } from "socket.io";
import * as dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI
const connection = mongoose.connect(MONGO_URI)
console.log(MONGO_URI)


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");




app.use("/", viewsRoute);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/realtimeproducts", realTimeProducts);



 const httpServer = app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});


const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  
  socket.on("mensaje", (data) => {
    console.log("Mensaje recibido:", data);

    
    socket.emit("respuesta", "Mensaje recibido correctamente");
  });

 
  socket.on("nuevo-producto",async (product) => {
    let title = product.title
    let description = product.description
    let code = product.code
    let price = +product.price
    let stock = +product.stock
    let category = product.category
    let thumbnail = product.thumbnail
    console.log(title, description, code, price, stock, category, thumbnail)
    console.log('producto agregado')
  });
  
  socket.on("eliminar producto", async (productId)=>{
    const {id} = productId
    let result = await ProductsModel.findByIdAndDelete(id)
    socket.emit("producto eliminado", result)
  })

  const productos = await ProductsModel.find({}).lean()
  socket.emit('actualizando productos', productos)

  
});