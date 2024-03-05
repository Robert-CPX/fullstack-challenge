import { parseLogs } from '@/lib/parser'
import { NextRequest, NextResponse } from 'next/server';

import io from 'socket.io-client';
const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);

export async function POST(req: NextRequest) {
  let passedValue = await new Response(req.body).text();
  const tx = parseLogs(passedValue)
  try {
    socket.emit('donation event', JSON.stringify(tx));
    return NextResponse.json({ data: 'Success' }, { status: 200 });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error }, { status: 200 })
  }
}