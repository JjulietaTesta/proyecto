import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt, { genSaltSync } from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { faker } from "@faker-js/faker";

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

export const authAdmin = (req, res, next)=>{
    if(req.user.user.role === "admin" || req.user.user.role === "premium") return next() 
    return res.send({status: "error", message: "Is not admin"})
}

export const passportCall = (strategy)=>{
    return async(req,res,next)=>{
        passport.authenticate(strategy,(error,user,info)=>{
            if(error) return next(error)
            if(!user) return res.json({status: "error", message: info.messages ? info.messages : info.toString()})
            user.role = "admin"
            req.user = user
            next()
        })(req,res,next)
    }
}

export const authorization = (role)=>{
    return async(req,res,next)=>{
        if(!req.user) return res.json({status: "error", message: "Error de autenticación"})
        if(req.user.user.role !== role) return res.json({status: "error", message: "Error de autenticación"})
        next()
    }
}


export const mockingProduct = () => {

    let numOfProducts = parseInt(faker.string.numeric())
    let products = []

    for (let i=0; i<=numOfProducts; i++) {
        products.push({
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            stock: faker.string.numeric(),
            id: faker.database.mongodbObjectId(),
            image: faker.image.url(),
            code: faker.commerce.isbn(),
            description: faker.commerce.productDescription()
        })
    }

    return products
}