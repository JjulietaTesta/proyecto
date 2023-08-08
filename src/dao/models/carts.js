import mongoose from "mongoose";

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products : {
        type: Array,
        require: true
    }
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel