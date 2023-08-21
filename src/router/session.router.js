import { Router } from "express";
import User from "../dao/models/user.js";

const router = Router()


router.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    const result = await User.find({
      email: username,
      password,
    })
    
    if (result.length === 0)
      return res.status(401).json({
        respuesta: "error",
      })
    else {
      req.session.user = username;
      req.session.admin = true;
      res.status(200).json({
        respuesta: "ok",
      })
    }
  })

router.post("/signup", async (req, res)=>{
   const {first_name, last_name, age, email, password} = req.body

   const result = User.create({
    first_name,
    last_name,
    age, 
    email,
    password
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

export default router