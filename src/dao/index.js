import {configuration} from "../config.js"

configuration()

import CarritoDao from "./memory/carrito.dao.js"
import ProductsDao from "./memory/products.dao.js"
import TicketMemoryDao from "./memory/ticket.dao.js"
import UserMemoryDao from "./memory/user.dao.js"

import  CarritoMongoDao from "./mongo/carrito.dao.js"
import  ProductsMongoDao from "./mongo/products.dao.js"
import  TicketMongoDao from "./mongo/ticket.dao.js"
import UsersMongoDao from "./mongo/user.dao.js"


export const PRODUCTS_DAO = process.env.PERSISTENCE === "MONGO" ?  new ProductsMongoDao() : new ProductsDao()
export const CARTS_DAO = process.env.PERSISTENCE === "MONGO" ?  new CarritoMongoDao() : new CarritoDao()
export const USER_DAO = process.env.PERSISTENCE === "MONGO" ? new UsersMongoDao() : new UserMemoryDao()
export const TICKET_DAO = process.env.PERSISTENCE === "MONGO" ? new TicketMongoDao() : new TicketMemoryDao()


