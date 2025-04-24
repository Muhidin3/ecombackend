import { NextResponse } from "next/server"
import Product from "../../models/other.model"

export async function GET(request:Request) {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const query = searchParams.get('q')

    const products = await Product.find({productName:{$regex:query,$options:'i'}}).limit(10)

return NextResponse.json({products})

}