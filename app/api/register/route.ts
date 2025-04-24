import { NextResponse } from "next/server"
import User from "../models/users.model"
import connectDB from "../config/db"
import bcrypt from "bcrypt"
export async function POST(req:Request){
    connectDB()
    const data = await req.json()
    const res = await User.find({name:data.name})
    if(res.length==0){
        const password = await bcrypt.hash(data.password,10)
        data.password = password
        const newUser = await new User(data)
        newUser.save()
        return NextResponse.json({message:'sucessful',})
    }
    else{
        return NextResponse.json({message:'user already exists'})
    }

}