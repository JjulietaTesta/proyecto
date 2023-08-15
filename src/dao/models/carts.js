import mongoose from "mongoose";

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products : [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                quantity: Number,
            }
        }
    ]
})

cartSchema.pre("findOne", function(next){
    this.populate("products.product")
    next()
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel