import { engine } from "express-handlebars";
import express from 'express';
import { __dirname, authToken } from "./utils.js";
import viewsRoute from "./router/views.router.js";
import ProductsModel from "./dao/mongo/models/products.js";
import messageModel from "./dao/mongo/models/messages.js";
import productRouter from "./router/product.router.js";
import chatRouter from "./router/chat.router.js"
import cartRouter from "./router/cart.router.js"
import { Server } from "socket.io";
import * as dotenv from 'dotenv';
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import loginRouter from "./router/login.router.js";
import signupRouter from "./router/signUp.router.js";
import sessionRouter from "./router/session.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";



dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI
const connection = mongoose.connect(MONGO_URI)

app.use(cookieParser())


app.use(session({
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }),
  secret: 'codersession',
  resave: false,
  saveUninitialized: false

}))


initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");




app.use("/", viewsRoute);
app.use("/products", authToken, productRouter);
app.use("/cart",authToken, cartRouter);
app.use("/chat", chatRouter );
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/api/session/", sessionRouter);


app.get("/login", (req,res)=>{
  res.render("login", {})
})

app.get("/session", (req, res) =>{
  if (req.session.counter){
    req.session.counter++
    res.send (`se ha visitado el sitio ${req.session.counter} veces`)
  } else {
    req.session.counter=1
    res.send("Primera vez en la pagina")
  }
})


app.get ("/logout", (req, res)=>{
  req.session.destroy(err =>{
    if(!err) {
      res.send("Has cerrado sesion")
    } else {
      res.json({
        status: "error al cerrar sesion",
        body: err
      })
    }
  })
})


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

 
  socket.on("agregar producto", (product) => {
      let title = data.title
      let description = data.description
      let code = data.code
      let price = +data.price
      let stock = +data.stock
      let category = data.category
      let thumbnail = data.thumbnail
      console.log(title,description,code,price,stock,category,thumbnail)
      console.log("Producto agregado correctamente")
  });
  
  socket.on("eliminar producto", async(data)=>{
    let id = data
    let result = await ProductsModel.findByIdAndDelete(id)
    console.log("producto eliminado", result)
  })

  const productos = await ProductsModel.find({}).lean()
  socket.emit("actualizar productos", productos)
  

  const mensajes = await messageModel.find({}).lean()
  socket.emit("enviar-msj", mensajes)
  socket.on("nuevos-msj", (data)=>{
    console.log(data+ "nuevos mensajes")
  })
  
});