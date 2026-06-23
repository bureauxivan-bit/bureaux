// Deprecated — visualizations are now managed via /rooms/[roomId]/visualizations
import { NextRequest } from 'next/server';

export async function POST(_req: NextRequest) {
  return Response.json({ error: 'Use /rooms/[roomId]/visualizations instead' }, { status: 410 });
}
