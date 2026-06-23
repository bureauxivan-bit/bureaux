// Deprecated — use /rooms/[roomId]/visualizations/[vizId] instead
import { NextRequest } from 'next/server';

export async function PATCH(_req: NextRequest) {
  return Response.json({ error: 'Use /rooms/[roomId]/visualizations/[vizId] instead' }, { status: 410 });
}

export async function DELETE(_req: NextRequest) {
  return Response.json({ error: 'Use /rooms/[roomId]/visualizations/[vizId] instead' }, { status: 410 });
}
