import winston from "winston"
import {configuration} from "../config.js"
configuration()


const devLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "debug"
        })
    ]
})


const prodLogger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: "errors.log",
            level: "error"
        })
    ]
})


export const addLogger = (req, res, next) => {
    req.logger = process.env.ENVIRONMENT === "production" ? prodLogger : devLogger;
    next();
};