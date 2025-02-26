import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { Result } from './Result';
import { newErrorResult, newOkResult } from './Result';

export const mapOkError = <T>(result: PostgrestSingleResponse<T>, context: string): Result<T> => {
  if (result.data) {
    return newOkResult(result.data);
  } else {
    return newErrorResult(new Error(result.error?.message ?? `Unexpected error in ${context}`));
  }
};

export const mapOkOrError = <F, T>(
  result: PostgrestSingleResponse<F | null>,
  mapFn: (f: F) => T,
  context: string,
): Result<T> => {
  if (result.data) {
    return newOkResult(mapFn(result.data));
  } else {
    return newErrorResult(new Error(result.error?.message ?? `Unexpected error in ${context}`));
  }
};

export const mapArrayOkOrError = <F, T>(
  result: PostgrestSingleResponse<F[]>,
  mapFn: (f: F) => T,
  context: string,
): Result<T[]> => {
  if (result.data) {
    return newOkResult(result.data.map(mapFn));
  } else {
    return newErrorResult(new Error(result.error?.message ?? `Unexpected error in ${context}`));
  }
};

export const mapOkNotFound = <T>(result: PostgrestSingleResponse<T | null>, context: string): Result<T> => {
  if (result.data) {
    return newOkResult(result.data);
  } else {
    return newErrorResult(new Error(`Not found in ${context}`));
  }
};
