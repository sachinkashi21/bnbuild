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
    },
    skills:[{
        type:String,
    }
    ],
    pastEvent:
    [{
        type:Schema.Types.ObjectId,
        ref: "Event",
    }],
    branch:{
        type: String,
    },
    about:{
        type: String,
    },
    year: {
        type: String,
    }
})
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema)