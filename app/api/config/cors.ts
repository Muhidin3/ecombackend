import { NextResponse } from "next/server";

// lib/cors.ts
export function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', 'https://ecom-mauve-eight.vercel.app'); // or set your frontend domain instead of '*'
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

  