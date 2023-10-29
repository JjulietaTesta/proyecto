import { USER_MODEL } from "./models/users.js";

export default class UsersMongoDao {

    async getUser(){
        return await USER_MODEL.find({})
    }

    async getUserByEmail(email){
        return await USER_MODEL.findOne({email:email})
    }

    async createUser(user){
        return await USER_MODEL.create(user)
    }
    
    async deleteUser(id){
        return await USER_MODEL.findByIdAndDelete(id)
    }

    async getUserById(id){
        return await USER_MODEL.findById(id)
    }

    async modifyUser(id, user){
        return await USER_MODEL.findByIdAndUpdate(id, user)
    }
}