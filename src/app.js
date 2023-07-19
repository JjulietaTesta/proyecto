import { engine } from "express-handlebars";
import express from 'express';
import { __filename, __dirname } from "./utils.js";
import viewsRoute from "./router/views.router.js";
import {createServer } from "http";
import { Server } from "socket.io";
import router from "./router/views.router.js";


const app = express();
const httpServer = createServer(app);

const PORT = 8080;


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);


app.use(express.static("public"));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/", viewsRoute);
app.use("/realtime", router);


httpServer.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});


const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  
  socket.on("mensaje", (data) => {
    console.log("Mensaje recibido:", data);

    
    socket.emit("respuesta", "Mensaje recibido correctamente");
  });

 
  socket.on("agregarProducto", (newProduct) => {
    console.log("Nuevo producto recibido backend:", newProduct);
    guardarProducto(newProduct);
    
    io.emit("nuevoProductoAgregado", newProduct);
  });
  
});