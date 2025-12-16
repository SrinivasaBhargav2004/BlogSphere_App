import mongoose from "mongoose";
mongoose.connect("mongodb://127.0.0.1:27017/Testing")
    .then(()=>console.log("MongoDB Server Connected"))
    .catch((err)=>console.log("MongoDB COnnection Error : ",err))
const ContactSchema=new mongoose.Schema(
    {
        email : {
            type:String,
            required:true
        },
        phno : {
            type:Number,
            required:true
        }
    }
)
const Contact=mongoose.model("Contact",ContactSchema)
export default Contact;