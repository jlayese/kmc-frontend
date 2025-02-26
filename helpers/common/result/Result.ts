export type Result<T, E = Error> = { ok: true; data: T } | { ok: false; error: E | undefined };

export const newOkResult = <T>(data: T): Result<T> => ({ ok: true, data });

export const newErrorResult = <T, E = Error>(error: E): Result<T, E> => ({
  ok: false,
  error,
});

export const newErrorStringResult = <T>(error: string): Result<T, Error> => newErrorResult(new Error(error));
