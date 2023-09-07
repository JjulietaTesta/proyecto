import passport from "passport";
import local from "passport-local"
import { createHash } from "../utils.js";
import GitHubStrategy from "passport-github2";
import User from "../dao/models/user.js";
import * as dotenv from "dotenv";
import cartModel from "../dao/models/carts.js";
import jwt, {ExtractJwt} from "passport-jwt"
import crypto from "crypto";


dotenv.config();
const LocalStrategy = local.Strategy
const JwtStrategy = jwt.Strategy
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const GITHUB_CALLBACKURL = process.env.GITHUB_CALLBACKURL



const initializePassport = ()=>{
    passport.use(
    'register', 
    new LocalStrategy(
        {
        passReqToCallback:true,
        usernameField: "email"},
        async(req,mail,pass,done) =>{
            const {first_name, last_name, email, age, password} = req.body
            try {
                const userAccount = await User.findOne({email:email})
                if(userAccount){
                    return done (null, false, {message: "Usuario existente"})
                } else {
                    const carrito = {
                        products : []
                    }
                    let cart = await cartModel.create(carrito)
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        cart: cart.id,
                        role: "user",
                        password: createHash(password)
                    }
                    const result = await User.create(newUser)
                    return done (null, result)
                }
                
            } catch (err) {
                return done (err)
            }
        }))
        
    passport.use ("jwt", new JwtStrategy({
        jwtFromRequest:ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "CoderPass"
    }, async (jwt_payload, done)=>{
        try {
            return done (null, jwt_payload)
        } catch (err){
            return done (err)
        }
    })) 

    passport.use("github", new GitHubStrategy({
        clientID : GITHUB_CLIENT_ID,
        clientSecret : GITHUB_CLIENT_SECRET,
        callbackURL : GITHUB_CALLBACKURL
    }, async(accessToken, refreshToken, profile, done)=>{
        try {
            console.log(profile)
            const user = await User.findOne({email:profile?.emails[0]?.value})
            if(!user){
                const newUser = {
                name: profile.displayName,
                last_name: profile.displayName,
                email: profile?.emails[0]?.value,
                user: profile.username,
                password: crypto.randomUUID()  
            }
            const result = await User.create(newUser)
            done (null, result)
            } else {
                done (null, user)
            }
        } catch (err){
            done (err, null)
        }
    }))
    
    passport.serializeUser((user, done)=>{
    done(null, user.id)
    })

    passport.deserializeUser(async(id, done)=>{
        let user = await User.findById(id)
        done (null, user)
    })
}
    
const cookieExtractor = (req)=>{
    let token = null
    if(req && req.cookies){
        token = req.cookies["coderCookieToken"]
    }
    return token
}
   

export default initializePassport