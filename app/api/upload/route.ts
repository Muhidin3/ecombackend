// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import formidable, { File } from 'formidable';
import { Readable } from 'stream';
import { IncomingMessage } from 'http';
import path from 'path';

// Required for formidable in Next.js App Router
export const config = {
  api: {
    bodyParser: false,
  },
};

// Convert Web ReadableStream to Node.js Readable
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

export async function POST(req: NextRequest) {
  const form = formidable({
    multiples: true,
    uploadDir: path.join(process.cwd(), '/uploads'),
    keepExtensions: true,
  });

  const nodeReadable = await readableStreamToNodeReadable(req.body!);

  // Create fake IncomingMessage
  const fakeReq = Object.assign(nodeReadable, {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: ''
  }) as IncomingMessage;

  return new Promise<NextResponse>((resolve) => {
    form.parse(fakeReq, (err, fields, files) => {
      if (err) {
        console.error(err);
        return resolve(NextResponse.json({ error: 'Form parsing failed' }, { status: 500 }));
      }

      const file = files.image?.[0] as File | undefined;

      return resolve(
        NextResponse.json({
          message: 'Upload successful',
          fields,
          file: file && {
            name: file.originalFilename,
            type: file.mimetype,
            path: file.filepath,
          },
        })
      );
    });
  });
}
