const mongoose = require("mongoose");
const {Schema}=mongoose;

let eventSchema= new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,

    },
    price: {
        type: Number,
        required: true,
    },
    organizer: {
        type:Schema.Types.ObjectId,
        ref: "User"
    },
    location: {
        type: String,
    },
    faq: [
        {
            content: String,
        },
    ],
    club: {
        type: String,
        required: true, 
    },
    date: {
        type: Date, 
    }
    // winners: 
    // date: 
    
    // deadline,
    // winners,
    
    
    // contactUs,
    // website
})

module.exports=mongoose.model("Event",eventSchema)