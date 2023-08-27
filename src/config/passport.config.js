import passport from "passport";
import GitHubStrategy from "passport-github2";
import User from "../dao/models/user.js";
import * as dotenv from "dotenv";
//import { createHash, isValidPassword } from "../utils.js";
//import local from "passport-local";

dotenv.config();
//const LocalStrategy = local.Strategy
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const GITHUB_CALLBACKURL = process.env.GITHUB_CALLBACKURL



const initializePassport = ()=>{
    passport.use(
    'github', 
    new GitHubStrategy(
        {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACKURL
    },
    async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({email: profile?.emails[0]?.value})
                if (!user) {
                    const newUser = {
                        first_name : profile.displayName.split(" ")[0],
                        last_name : profile.displayName.split(" ")[1],
                        email: profile?.emails[0]?.value,
                        age: 26,
                        password: "",
                        } 
                
                let result = await User.create(newUser)
                done (null, result)
                }
               else {
                done (null, user)
               }
            }
            catch (error) {
              done (error, null)
            }
        }
    ))


    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done)=>{
        try {
        let user = await User.findById(id)
        done (null, user)
        } catch (err) {
            done (err,null)
        }
    })

}
    
    /*const initializePassport = ()=>{
    passport.use(
    'register', 
    new LocalStrategy(
        {
        passReqToCallback:true,
        usernameField: 'email'
    },
    async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body
            try {
                const user = await User.findOne({email: username})
                if (user) {
                    return done(null, false, {message: 'el usuario ya existe'})
                }
                const newUser = {
                    first_name, 
                    last_name,
                    email,
                    age, 
                    password: createHash(password),
                    }
                let result = await User.create(newUser)
                return done (null, result)
            }
            catch (error) {
                return done ('Error al obtener usuario', error)
            }
        }
    )) 
    */
    
    
   /*
    passport.use(
        "login",
        new LocalStrategy({
            passReqToCallback: true,
            
            passwordField: "password"
        },
        async(req, username, password, done)=>{
            try {
                const user = await User.findOne({email:username})
                if (!user) {
                    return done (null, false, {message: "no se ha encontrado el usuario"} )
                }
                if (!isValidPassword(user.password, password)){
                    return done (null, false, {message: "contrasena incorrecta"})
                } else {
                    return done (null, user)
                } 
            
            } catch (error) {
                return done ("error al obtener el usuario", error)
            }
        }
        )
    )
}
passport.serializeUser((user, done)=>{
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done)=>{
        let user = await User.findById(id)
        done (null, user)
    })




*/
export default initializePassport