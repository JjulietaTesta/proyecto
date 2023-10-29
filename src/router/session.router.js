import { Router } from "express";
import { isValidPassword } from "../utils.js";
import passport from "passport";
import { generateToken, passportCall, authorization } from "../utils.js";
import {UsersRepository} from "../dao/repository/users.repository.js"
import {USER_DAO} from "../dao/index.js"
import CustomError from "../services/errors/customErr.js";
import Eerrors from "../services/errors/enum.js";
import { generateUserErrorInfo } from "../services/errors/info.js";
import { transport } from "../mailler/nodemailler.js";

const userService = new UsersRepository(USER_DAO)

let userTemp = ""

const router = Router()

router.get("/session/signup",(req,res)=>{
  res.render("signup",{title: "Registrarse", style: "style.css", script: "signup.js"})
})


router.get("/",(req,res)=>{
  res.render("login",{title: "Login", style: "style.css", script: "login.js"})
})

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/failLogin",
  }),
  async (req, res) => {
    if (!req.user) {
      CustomError.createError({
        name: "Usuario o contraseña incorrectos",
        cause: generateUserErrorInfo({
          first_name,
          last_name,
          age,
          email
        }),
        message: "Los datos son incorrectos, verifique",
        code: Eerrors.INVALID_TYPES_ERROR
      })
    }
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
    };
    req.session.admin = true;

    res.send({ status: "success", mesage: "user logged", user: req.user });
  }
);

router.post("/login",async(req,res)=>{
  const {email,password} = req.body
  const user = await user.findOne({email: email})
  if(!user){
      CustomError.createError({
        name: "Usuario no encontrado",
        cause: generateUserErrorInfo({
          first_name,
          last_name,
          age,
          email
        }),
        message: "Usuario incorrecto",
        code: Eerrors.INVALID_TYPES_ERROR
      })
  }else{
      if(!isValidPassword(password,user.password)){
        CustomError.createError({
          name: "Contraseña incorrecta",
          cause: generateUserErrorInfo({
            first_name,
            last_name,
            age,
            email
          }),
          message: "Contraseña incorrecta",
          code: Eerrors.INVALID_TYPES_ERROR
        })
      }else{
          const myToken = generateToken(user)
          res.cookie("coderCookieToken",myToken,{ 
             maxAge: 60 * 60 * 1000,
             httpOnly: true
          })
          return res.json({status: "success"}) 
      }
  }
})

router.get("/current",passportCall("jwt"),authorization("admin"),(req,res)=>{
  res.send(req.user)
})

router.get("/logout",(req,res)=>{
  req.session.destroy(err=>{
      if(!err){
         return res.json({
          message: "Sesión cerrada"
         })
      }else{
         return res.json({
          message: "Error al cerrar sesión"
         }) 
      }
  })
})


router.get ("/failogin", async (req, res) =>{
  res.send({error: "failed"})
})


router.post("/signup", passport.authenticate('register',{
  failureRedirect:"/failogin"}),
  async (req, res) => {
    res.send({status: "success", message: "usuario registrado"} )
  }
)


router.get ("/github", passport.authenticate("github", {scope: ["user:email"]}),
  async(req, res) => {}
)


router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.admin = true;
    res.redirect("/");
  }
);

router.get("/recover",(req,res)=>{
  res.render("recoverPassword", {title: "Recover password", script: "recoverPassword.js", style: "recoverPassword.css", PORT: process.env.PORT})
})

router.post("/recoverPassword",async(req,res)=>{
  const {mail} = req.body
  try{
    await transport.sendMail({
      from: "Forgot password <coder123@gmail.com>", 
      to: mail,
      subject: "Forgot password",
      headers: {
          'Expiry-Date': new Date(Date.now() + 3600 * 1000).toUTCString()
      },
      html: `
          <h1>Forgot password</h1>
       <a href="http://localhost:${process.env.PORT}/replacePassword"><button>Recuperar contraseña</button></a>
      `
     })
     userTemp = await userService.getUserByEmail(mail)
     res.json({status: "success", message: "Mail sended"})
  }catch(err){
      console.log(err)
  }
})

router.get("/replacePassword",(req,res)=>{
  res.render("replacePassword", {title: "Replace Password", style: "replacePassword.css", script: "replacePassword.js"})
})

router.post("/replace",async(req,res)=>{
  try{
  const {pass} = req.body
  const user = await userService.getUserByEmail(userTemp.email)
  console.log(user.password)
  if(isValidPassword(pass,user.password)){
      return res.json({status: "error", message: "same password"})
  }else{
      user.password = createHash(pass)
      const data = await userService.modifyUser(user.id,user)
      res.json({status: "Success", message: "Password replaced", data})
  }
  }catch(err){
      console.log(err)
  }
})



export default router