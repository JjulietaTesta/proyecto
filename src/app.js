import { engine } from "express-handlebars";
import express from 'express';
import { __dirname, authToken } from "./utils.js";
import viewsRoute from "./router/views.router.js";
import productRouter from "./router/product.router.js";
import chatRouter from "./router/chat.router.js"
import cartRouter from "./router/cart.router.js"
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import loginRouter from "./router/login.router.js";
import signupRouter from "./router/signUp.router.js";
import sessionRouter from "./router/session.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import {configuration} from "./config.js"
import { ProductsRepository } from "./dao/repository/products.repository.js";
import { PRODUCTS_DAO } from "./dao/index.js"
import PRODUCTS_MODEL from "./dao/mongo/models/products.js"
import mockRouter from "./router/mock.router.js"
import errorHandler from "./middleware/errors.js"
import { loggerRouter } from "./router/logger.router.js";



configuration()
const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI
const connection = mongoose.connect(MONGO_URI)

const ENVIROMENT = process.env.ENVIROMENT

app.use(cookieParser())
app.use(errorHandler)



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




app.use("/views", viewsRoute);
app.use("/products", productRouter);
app.use("/cart",authToken, cartRouter);
app.use("/chat", chatRouter );
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/", sessionRouter);
app.use("/mockingproducts", mockRouter)
app.use("/loggerTests", loggerRouter)


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

const productsService = new ProductsRepository(PRODUCTS_DAO)


socketServer.on("connection", async (socket) => {
    console.log("Nueva conexión establecida"); 


    socket.on("disconnect",()=>{
        console.log("Usuario desconectado")
    })
    
      
      socket.on("new-product", async (data) => {
      const newProduct = await productsService.saveProduct(data) 
      
      const productos = process.env.PORT === "8080" ? await PRODUCTS_MODEL.find({}).lean({}) : await productsService.getProducts()
      socket.emit("update-products", productos)
    });

    
    socket.on("delete-product",async(data)=>{  
        let id = data;
        let result = await productsService.deleteProduct(id);
        console.log("Producto eliminado", result);
        
        const productos = process.env.PORT === "8080" ? await PRODUCTS_MODEL.find({}).lean({}) : await productsService.getProducts()
        socket.emit("update-products", productos)
    })

    
    const productos = process.env.PORT === "8080" ? await PRODUCTS_MODEL.find({}).lean({}) : await productsService.getProducts()
    socket.emit("update-products", productos) 
  })