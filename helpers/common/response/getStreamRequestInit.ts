export const getStreamRequestInit = (body: BodyInit): RequestInit => ({
  method: 'POST',
  headers: {
    'Content-Type': 'text/event-stream',
  },
  credentials: 'include',
  body,
});
