import mongoose from "mongoose";

const MobileSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    brand:{
        type:String,
    },
    price:{
        type:Number,
    },
    description:{
        type:String,
    },
})

export const Mobile = mongoose.model('Mobile',MobileSchema)



const ComputerSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    brand:{
        type:String,
    },
    price:{
        type:Number,
    },
    description:{
        type:String,
    },
})

export const Computer = mongoose.model('Computer',ComputerSchema)



const OtherElectronicsSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    brand:{
        type:String,
    },
    price:{
        type:Number,
    },
    description:{
        type:String,
    },
    

})

export const OtherElectronics = mongoose.model('OtherElectronics',OtherElectronicsSchema)

// module.exports={Computer,Mobile,OtherElectronics}

