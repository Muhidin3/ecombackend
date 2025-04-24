import mongoose from "mongoose";

const OtherSchema = new mongoose.Schema({
    productName:String,
    price:Number,
    condition:String,
    category:String,
    subcategory:String,
    description:String,
    image:{type:String,default:'no image uploaded'},
    user:{type:String,default:'no user'},
},{timestamps:true})

const Product = mongoose.models.Product || mongoose.model('Product',OtherSchema)


export default Product