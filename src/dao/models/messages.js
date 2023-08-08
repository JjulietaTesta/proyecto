import mongoose from "mongoose";

const messagesCollection = 'messages';

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        require: true
    },

    message: {
        type: String
    }
})

const MessageModel = mongoose.model(messagesCollection, messageSchema)

export default MessageModel