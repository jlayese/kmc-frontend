import type { Result } from '@/helpers/common/result/Result';

export const unwrap = <T>(result: Result<T>): T => {
  if (!result.ok) {
    throw result.error;
  }

  return result.data;
};
