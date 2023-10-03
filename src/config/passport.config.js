import passport from "passport";
import local from "passport-local"
import { createHash } from "../utils.js";
import GitHubStrategy from "passport-github2";
import jwt, {ExtractJwt} from "passport-jwt"
import crypto from "crypto";
import { configuration } from "../config.js";
import { CARTS_DAO } from "../dao/index.js";
import { USER_DAO} from "../dao/index.js";
import { UsersRepository } from "../dao/repository/users.repository.js"

const userService = new UsersRepository(USER_DAO)

configuration()

const LocalStrategy = local.Strategy
const JwtStrategy = jwt.Strategy
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const GITHUB_CALLBACKURL = process.env.GITHUB_CALLBACKURL



const intializePassport = async()=>{
    passport.use("register",new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"},async(req,mail,pass,done)=>{
            const {first_name,last_name,email,age,password} = req.body
            try{
                const userAccount = await userService.getUserByEmail(email)
                if(userAccount){
                    return done(null,false,{message: "Tu usuario ya existe"})
                }else{
                    const CART = {
                        products : []
                    }
                    let cart = await CARTS_DAO.saveCart(CART) 
                    const newUser = { 
                        first_name,
                        last_name,
                        email,
                        age,
                        cart: cart.id,
                        role: "user", 
                        password: createHash(password)
                    }
                    const result = await userService.createUser(newUser)
                    return done(null,result)
                }
            }catch(err){
                return done(err)
            }
        }))

    passport.use("jwt", new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "CoderKeySecreta"
    },async(jwt_payload,done)=>{
        try{
            return done(null,jwt_payload)
        }catch(err){
            return done(err)
        }
    }))

    passport.use("github",new GitHubStrategy({
        clientID : GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACKURL
    },async(accessToken,refreshToken,profile,done)=>{
          try{
            console.log(profile)
           const user = await userService.getUserByEmail(profile?.emails[0]?.value)
           if(!user){ 
            const newUser = {
                name: profile.displayName,
                last_name: profile.displayName,
                email: profile?.emails[0]?.value,
                user: profile.username,
                password: crypto.randomUUID()
            }
            const result = await userService.createUser(newUser)
            done(null,result)
           }else{
            done(null,user)
           }
          }catch(err){
            done(err,null)
          }
    }))
 
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    
    passport.deserializeUser(async (id, done) => {
        let user = await userService.getUserById(id)
        done(null, user) 
    })
}

const cookieExtractor = (req)=>{
    let token = null
    if(req && req.cookies){
        token = req.cookies["coderCookieToken"]
    }
    return token
}

export default intializePassport