import { NextRequest, NextResponse } from "next/server";
import Product from "../models/other.model";

export const config = {
    api: {
      bodyParser: true,
    },
  };
  


export async function GET(req:NextRequest) {
    const {searchParams} = new URL(req.url) 
    const name = searchParams.get('name')
    const data = await Product.find({user:name})
    return NextResponse.json({m:'gotit',data})    
}