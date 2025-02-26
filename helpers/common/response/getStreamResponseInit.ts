export const getStreamResponseInit = (response?: Partial<ResponseInit>): ResponseInit => ({
  headers: {
    'Content-Type': 'text/event-stream; charset=utf-8',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache, no-transform',
    ...response?.headers,
  },
});
