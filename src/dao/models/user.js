import mongoose from "mongoose";

const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        require: true, 
        max: 100
    },
    last_name:{
        type: String,
        require: true, 
        max: 100
    },
    email:{
        type: String,
        require: true, 
        max: 100,
        unique: true
    },
    password: {
        type: String,
        require: true, 
        max: 100  
    },
    age: {
        type: Number,
        require: true, 
        max: 100 
    }
    
})


export const User = mongoose.model(userCollection, userSchema)

export default User