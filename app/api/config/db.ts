import mongoose from "mongoose";    


async function connectDB(){
     
    if (mongoose.connection.readyState==1) {
        return
    }else if(mongoose.connection.readyState==2){
        console.log('Connecting...')
        return
    }
    try {
        await mongoose.connect(process.env.MONGO_URL as string)
        console.log(`mongodb connected successfuly ${mongoose.connection.host}`)
        
    } catch (error) {
        console.log(`error connecting to the server: ${error}`)
    }
    return
}


export default connectDB

//'mongodb://localhost:27017/Ecom''