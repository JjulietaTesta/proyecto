import { USER_DAO } from "../dao/index.js";
import { UsersRepository } from "../dao/repository/users.repository.js";
import CustomError from "../services/errors/customErr.js";
import Eerrors from "../services/errors/enum.js";
import { LOGGER } from "../dao/index.js";

const userService = new UsersRepository(USER_DAO)

async function changeRoleUser(req,res){
    req.logger = LOGGER
    const {uid} = req.params
    try{
        const user = await userService.getUserById(uid)
        user.role = user.role === "user" ? "premium" : "user" 
        const response = await userService.modifyUser(uid,user)
        res.redirect("/")
    }catch(err){ 
        const error = CustomError.createError({
            name: "Products Error",
            message: "Error get products",
            cause: err,
            code: Eerrors.DB_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({status: "error", error}) 
    } 
}

export {changeRoleUser}