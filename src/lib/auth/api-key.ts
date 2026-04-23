import { NextResponse } from 'next/server';

export function validateApiKey(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.split(' ')[1];
  const validKey = process.env.INTERNAL_API_KEY;
  
  if (!validKey) {
    console.warn('INTERNAL_API_KEY is not configured in environment variables');
    return false;
  }
  
  return token === validKey;
}

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Unauthorized: Invalid or missing API key' },
    { status: 401 }
  );
}
