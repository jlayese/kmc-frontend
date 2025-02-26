import { z } from 'zod';

export const errorResponseSchema = z.object({
  errors: z.array(z.object({ message: z.string(), status: z.number() })),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const isErrorResponse = (data: unknown): data is ErrorResponse | null =>
  errorResponseSchema.safeParse(data).success;

export const newErrorResponse = (message: string, status: number): ErrorResponse => ({
  errors: [{ message, status }],
});

export const FORBIDDEN = 'Forbidden';

export const newForbiddenResponse = (): Response =>
  new Response(JSON.stringify(newErrorResponse('Forbidden', 401)), {
    status: 401,
  });

export const UNAUTHORIZED = 'Unauthorized';

export const newUnauthorizedResponse = (): Response =>
  new Response(JSON.stringify(newErrorResponse('Unauthorized', 403)), {
    status: 403,
  });

export const newInternalServerErrorResponse = (): Response =>
  new Response(JSON.stringify(newErrorResponse('Internal Server Error', 500)), {
    status: 500,
  });

export const BAD_REQUEST = 'Bad Request';

export const newBadRequestResponse = (): Response =>
  new Response(JSON.stringify(newErrorResponse('Bad Request', 400)), {
    status: 400,
  });

export const newNotFoundResponse = (message: string): Response =>
  new Response(JSON.stringify(newErrorResponse(message, 404)), {
    status: 404,
  });
