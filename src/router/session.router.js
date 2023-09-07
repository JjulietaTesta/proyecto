import { Router } from "express";
import User from "../dao/models/user.js";
import { isValidPassword } from "../utils.js";
import passport from "passport";
import { generateToken, passportCall, authorization } from "../utils.js";

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
      return res.status(401).json("error de autenticacion");
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
  const user = await User.findOne({email: email})
  if(!user){
      return res.json({status: "error", message: "User not found"})
  }else{
      if(!isValidPassword(password,user.password)){
          return res.json({status: "error", message: "Invalid password"})
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

router.get("/current",passportCall("jwt"),authorization("user"),(req,res)=>{
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


export default router