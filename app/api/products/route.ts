/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import Product from '../models/other.model';
import { Readable } from 'stream';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs'
import { IncomingMessage } from 'http';
import connectDB from '../config/db';
import { setCorsHeaders } from '../config/cors';

export async function OPTIONS() {
  const res = new NextResponse(null);
  return setCorsHeaders(res);
}


export async function GET(req:NextRequest) {
  connectDB()
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || ''
  const subcategory = searchParams.get('subcategory')|| ''
  const condition = searchParams.get('condition')|| ''
  const maxPrice = searchParams.get('maxPrice')|| ''
  const minPrice = searchParams.get('minPrice')|| ''
  const recentlyPosted = searchParams.get('recentlyPosted')|| ''
  console.log('category',category)

  const query: any = {};

  // Category filter
  if (category) {
    query.category = category;
  }

  // Subcategory filter
  if (subcategory) {
    query.subcategory = subcategory;
  }

  // Price filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) {
      query.price.$gte = Number(minPrice);
    }
    if (maxPrice) {
      query.price.$lte = Number(maxPrice);
    }
  }

  // Condition filter
  if (condition) {
    query.condition = condition; // 'New' or 'Used'
  }

  // Now sorting
  let sortOption = {};
  if (recentlyPosted === 'newest') {
    sortOption = { createdAt: -1 }; // Newest first
  } else if (recentlyPosted === 'oldest') {
    sortOption = { createdAt: 1 }; // Oldest first
  }





  const res = await Product.find(query).sort(sortOption)
  if(!res){
    return NextResponse.json({ message: 'NO product',data:[{}] });
  }
  return NextResponse.json({ message: 'Product list',data:res });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readableStreamToNodeReadable(stream: ReadableStream<Uint8Array>): Promise<Readable> {
  const reader = stream.getReader();
  const nodeStream = new Readable({
    read() {
      reader.read().then(({ done, value }) => {
        if (done) this.push(null);
        else this.push(value);
      });
    }
  });
  return nodeStream;
}

export async function POST(req:Request) {
  await connectDB()
  
  const form = formidable({ multiples: true });
  const nodeStream = await readableStreamToNodeReadable(req.body!) 
  
 


  return new Promise<NextResponse>((resolve) => {

  
    const fakeReq = Object.assign(nodeStream, {
      headers: Object.fromEntries(req.headers.entries()),
      method: req.method,
      url: ''
    }) as IncomingMessage;

    form.parse(fakeReq, async (err, fields, files) => {
      if (err){
        console.error(err);
        return resolve(NextResponse.json({ error: 'Error parsing form data' }, { status: 500 }));
      }
    
      const image = files.image![0] 
      
      if(image){

      const uploadDir = path.join(process.cwd(), 'public/uploads');
      const filePath = path.join(uploadDir, image.newFilename);
      fs.rename(image.filepath, filePath,()=>console.log('img uploaded'));
      const editedData:Record<string,any> = {}

      for (let index = 0; index < Object.keys(fields).length; index++) {
        const key:string = Object.keys(fields)[index] 
        editedData[key] = fields[key]![0]
       }

       editedData['image'] = image.newFilename
       const newProduct = new Product(editedData);
       const res = await newProduct.save();

       const ress = NextResponse.json({ message: 'upload received',res:res })
       return resolve(setCorsHeaders(ress));

      }

      















  })
})







  
  // return NextResponse.json({ message: 'Product added' });
}
