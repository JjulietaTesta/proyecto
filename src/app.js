import { engine } from "express-handlebars";
import express from 'express';
//import productRouter from "./router/product.router.js";
//import cartRouter from "./router/cart.router.js";
import viewsRoute from "./router/views.router.js";
import {createServer } from "http";
import { Server } from "socket.io";
import router from "./router/views.router.js";


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = createServer(app);

app.engine ("handlebars", engine());
app.set("view engine", "handlebars");
app.set ("views", "./views");

app.use(express.static("public"));

app.use ("/", router);

app.use("/", viewsRoute);


httpServer.listen (PORT, ()=>{
    console.log("el server esta corriendo en el puerto 8080")
})

export const io = new Server (httpServer);

