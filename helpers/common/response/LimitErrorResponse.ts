import { newErrorResponse } from './ErrorResponse';

export const TOO_MANY_REQUESTS = 'Too Many Requests';

export const YOU_ARE_RATE_LIMITED = 'You are rate-limited, please try again after a few minutes.';

export const newYouAreRateLimitedResponse = (): Response =>
  new Response(JSON.stringify(newErrorResponse(YOU_ARE_RATE_LIMITED, 429)), {
    status: 429,
  });
