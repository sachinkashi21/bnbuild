const mongoose = require("mongoose");
const {Schema}=mongoose;
const passportLocalMongoose=require("passport-local-mongoose");

let userSchema= new Schema({
    email:{
        type: String,
        required: true,
    },
    detail:{
        type: String,
        enum: ["student","organizer"],
    }
})
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema)