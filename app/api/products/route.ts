/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import Product from '../models/other.model';
import { Readable } from 'stream';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs'
import { IncomingMessage } from 'http';
import connectDB from '../config/db';

export async function GET() {
  connectDB()
  const res = await Product.find()
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

       return resolve(NextResponse.json({ message: 'upload received',res:res }));

      }

      















  })
})







  
  // return NextResponse.json({ message: 'Product added' });
}
