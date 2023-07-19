import { engine } from "express-handlebars";
import express from 'express';
import { __dirname } from "./utils.js";
import viewsRoute from "./router/views.router.js";
import productRouter from "./router/product.router.js";
import cartRouter from "./router/cart.router.js";
import realTimeProducts from "./router/realTimeProduct.router.js";
import { Server } from "socket.io";
import { saveProduct } from "./services/productUtils.js";
import { deleteProduct } from "./services/productUtils.js";


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);




app.use("/", viewsRoute);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/realtimeproducts", realTimeProducts);



 const httpServer = app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});


const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  
  socket.on("mensaje", (data) => {
    console.log("Mensaje recibido:", data);

    
    socket.emit("respuesta", "Mensaje recibido correctamente");
  });

 
  socket.on("agregarProducto", product => {
    saveProduct(product)
    socket.emit(product)
    
  });
  
  socket.on("eliminar producto", productId=>{
    const {id} = productId
    deleteProduct(id)
    socket.emit("producto eliminado", id)
  })

  
});