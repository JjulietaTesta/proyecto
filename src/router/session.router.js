import { Router } from "express";
import User from "../dao/models/user.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router()



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

/*
  router.post("/signup", async (req, res)=>{
   const {first_name, last_name, age, email, password} = req.body

   const result = User.create({
    first_name,
    last_name,
    age, 
    email,
    password: createHash(password)
   })

   if (result===null){
    return res.status(401).json({
        respuesta: "error",
      })
   } else {
    req.session.user = email;
    req.session.admin = true;
    res.status(200).json({
      respuesta: "ok",
    })
   }

router.get("/logout", async (req, res)=>{
    req.session.destroy(err=>{
        if(!err){
            return res.json({message: "has cerrado sesión"})
        } else {
            return res.json({message: "error al cerrar sesión"})
        }
    })
})

   
})
*/

router.get ("/failogin", async (req, res) =>{
  res.send({error: "failed"})
})


router.post("/signup", passport.authenticate('register',{
  failureRedirect:"/failogin"}),
  async (req, res) => {
    res.send({status: "success", message: "usuario registrado"} )
  }
)





export default router