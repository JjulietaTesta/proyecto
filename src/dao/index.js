import {configuration} from "../config.js"

configuration()
import winston from "winston"

const devLogger = winston.createLogger({
    transports:[
        new winston.transports.Console({
            level: "debug"
        }),
        new winston.transports.Console({
            level: "http"
        })
    ]
})

const prodLogger = winston.createLogger({
    transports:[
        new winston.transports.Console({
            level: "info"
        }),
        new winston.transports.Console({
            level: "warn"
        }),
        new winston.transports.File({
            level: "error",
            filename: "./errors.log"
        }),
        new winston.transports.Console({
            level: "verbose"
        })
    ]
})

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
export const LOGGER = process.env.ENVIRONMENT === "DEVELOPMENT" ? devLogger : prodLogger


