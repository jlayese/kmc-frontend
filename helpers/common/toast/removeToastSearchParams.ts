import { TOAST_MESSAGE, TOAST_TYPE } from './constant';

export const removeToastSearchParams = (searchParams: URLSearchParams): URLSearchParams => {
  const newSearchParams = new URLSearchParams(searchParams.toString());
  newSearchParams.delete(TOAST_TYPE);
  newSearchParams.delete(TOAST_MESSAGE);

  return newSearchParams;
};
