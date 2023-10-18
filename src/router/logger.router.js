import Router from "express"
import {getLogger} from "../controller/logger.controller.js"

const loggerRouter = Router()

loggerRouter.get("/",getLogger)

export {loggerRouter}