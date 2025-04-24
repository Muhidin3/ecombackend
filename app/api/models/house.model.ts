import mongoose from "mongoose";

const HouseSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    squareArea:{
        type:String,
    },
    place:{
        type:String,
    },
    price:{
        type:Number,
    },
    description:{
        type:String,
    },
    

})

const House = mongoose.model('House',HouseSchema)


export default House