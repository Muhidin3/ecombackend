import { NextRequest, NextResponse } from "next/server";
import Product from "../../models/other.model";
import path from "path";
import formidable from "formidable";
import fs from 'fs'
import User from "../../models/users.model";
import { IncomingMessage } from "http";
import { Readable } from "stream";

interface Params{
    params:Promise<{id:string}>
}

export async function GET(req:NextRequest,{params}: {params: Promise<{ id: string }>}) {
  const id = (await params).id
    try {
        const res = await Product.findById(id)
        const user = await User.findById(res.user)
        const data = res
        data.user = user.name
        return NextResponse.json({message:'got it',res})
        
    } catch (error) {
        console.error(error)
        return NextResponse.json({message:`can't get the product`})
        
    }
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


export async function PATCH(req:NextRequest,{params}:Params) {
    const {id} = await params
    const form = formidable({ multiples: true });
    
    const nodeStream = await readableStreamToNodeReadable(req.body!) 
  
    const fakeReq = Object.assign(nodeStream, {
      headers: Object.fromEntries(req.headers.entries()),
      method: req.method,
      url: ''
    }) as IncomingMessage;

    return new Promise<NextResponse>((resolve) => {
  
      form.parse(fakeReq, async (err, fields, files) => {
        if (err){
          console.error(err);
          return resolve(NextResponse.json({ error: 'Error parsing form data' }, { status: 500 }));
        }
      
        
        if(files.image){
        const image = files.image[0] 
  
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        const filePath = path.join(uploadDir, image.newFilename);
        fs.rename(image.filepath, filePath,()=>console.log('img uploaded'));
        const editedData:Record<string,unknown> = {}
  
        for (let index = 0; index < Object.keys(fields).length; index++) {
          const key:string = Object.keys(fields)[index] 
          editedData[key] = fields[key]![0]
         }
  
         editedData['image'] = image.newFilename
         const newProduct = await Product.findByIdAndUpdate(id,editedData);
  
         return resolve(NextResponse.json({ message: 'Edited successfully',res:newProduct }));
  
        }else{
            const editedData:Record<string,unknown> = {}
  
            for (let index = 0; index < Object.keys(fields).length; index++) {
              const key:string = Object.keys(fields)[index] 
              editedData[key] = fields[key]![0]
             }
             const newProduct = await Product.findByIdAndUpdate(id,editedData);
             
             return resolve(NextResponse.json({ message: 'Edited successfully',res:newProduct }));

        }
  
        
    })
  })
  
  

    // return NextResponse.json({ message: 'Product added' });
  }


export async function DELETE(req:Request,{params}:Params) {
  const {id} = await params
  
  try {
      const product = await Product.findByIdAndDelete(id)
      return NextResponse.json({message:'Product deleted', product})
      
  } catch (error) {
      return NextResponse.json({message:'we got an error do something', error})
      
  }
}