import mongoose from "mongoose";
mongoose.connect("mongodb://127.0.0.1:27017/Testing")
    .then(()=>console.log("MongoDB Server Connected"))
    .catch((err)=>console.log("MongoDB Connection Error : ",err))
    const UserSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    });
     
const User=mongoose.model("User",UserSchema)
export default User;