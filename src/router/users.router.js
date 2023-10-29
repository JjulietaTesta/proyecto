import { Router } from "express";
import { changeRoleUser } from "../controller/users.controller.js";

const usersRouter = Router()

usersRouter.get("/premium/:uid",changeRoleUser)

export {usersRouter}