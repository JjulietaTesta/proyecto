import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt, { genSaltSync } from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const createHash = password => bcrypt.hashSync(password, genSaltSync(10))
export const isValidPassword = (savedPassword, password) => bcrypt.compareSync(password, savedPassword)

let privateKey = "CoderPass"

export const generateToken = (user)=>{
    const token = jwt.sign({user},privateKey,{expiresIn: "1h"})
    return token
}

export const authToken = (req,res,next)=>{
    let auth = req.cookies.coderCookieToken
    if(!auth) return res.json({status: "error", message: "Invalid auth"})

    const token = auth

    jwt.verify(token,privateKey,(err,user)=>{
        if(err) res.json({status: "error", message: "Invalid Token"})
        req.user = user
        next()
    })
}

export const passportCall = (strategy)=>{
    return async(req,res,next)=>{
        passport.authenticate(strategy,(error,user,info)=>{
            if(error) return next(error)
            if(!user) return res.json({status: "error", message: info.messages ? info.messages : info.toString()})
            req.user = user
            next()
        })(req,res,next)
    }
}

export const authorization = (role)=>{
    return async(req,res,next)=>{
        if(!req.user) return res.json({status: "error", message: "Unauthorized"})
        if(req.user.user.role !== role) return res.json({status: "error", message: "UnauthorizeD"})
        next()
    }
}