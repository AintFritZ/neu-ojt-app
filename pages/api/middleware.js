import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'c99cc9c3d7434da85f4af9ff55cccd54341c1ea43841b8f280f9b01025b9c912';

export default function middleware(req) {
  const token = req.cookies.token;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url)); 
  }

  try {
    jwt.verify(token, SECRET_KEY);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL('/login', req.url)); 
  }
}

export const config = {
  matcher: '/protected/:path*',
};
