import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followers:{
        type:[mongoose.Schema.ObjectId],
        ref:"users"
    },
    refreshToken:{
        type:String
    }
  
    
})

const userModel = new mongoose.model('users',userSchema)
export default userModel