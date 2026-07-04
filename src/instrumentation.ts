// Next.js instrumentation hook (stable since v14, no experimental flag needed).
// onRequestError fires for uncaught errors in Server Components, Route Handlers
// and Server Actions — the bulk of "server crashed" scenarios.
export async function register() {}

export async function onRequestError(
  err: unknown,
  request: { path?: string; method?: string },
) {
  const { notifyServerError } = await import('@/lib/telegram');
  const error = err as Error;
  await notifyServerError({
    timestamp: new Date(),
    message: error?.message ?? String(err),
    stack: error?.stack,
    url: request?.path,
  });
}
