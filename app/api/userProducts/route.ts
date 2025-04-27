import { NextRequest, NextResponse } from "next/server";
import Product from "../models/other.model";
import connectDB from "../config/db";

export const config = {
    api: {
      bodyParser: true,
    },
  };
  


export async function GET(req:NextRequest) {
  connectDB()
    const {searchParams} = new URL(req.url) 
    const name = searchParams.get('name')
    const data = await Product.find({user:name})
    return NextResponse.json({m:'gotit',data})    
}