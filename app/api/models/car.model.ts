import mongoose from "mongoose";

const CarSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    brand:{
        type:String,
        require:true
    },
    year:{
        type:Number,
        require:true
    },
    mileage:{
        type:Number,
        require:true
    },
    license:{
        type:String
    },
    fuel:{
        type:String
    },
    price:{
        type:Number,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    

},{timestamps:true})

const Car = mongoose.model('Car',CarSchema)


export default Car
