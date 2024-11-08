import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    image: {
        type: String,
       
    }
});

const postModel = new mongoose.model('posts',postSchema)
export default postModel
