import { NextResponse } from "next/server"
import Product from "../../models/other.model"
import connectDB from "../../config/db"

export async function GET(request:Request) {
    connectDB()
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const query = searchParams.get('q')

    const products = await Product.find({productName:{$regex:query,$options:'i'}}).limit(10)

return NextResponse.json({products})

}