import type { ToastType } from './ToastType';
import { TOAST_MESSAGE, TOAST_TYPE } from './constant';

type Args = {
  type: ToastType;
  message: string;
};

export const newToastSearchParams = ({ type: toastType, message: toastMessage }: Args): URLSearchParams => {
  const searchParams = new URLSearchParams();

  searchParams.set(TOAST_TYPE, toastType);
  searchParams.set(TOAST_MESSAGE, toastMessage);

  return searchParams;
};

export const SOMETHING_WENT_WRONG = 'Something went wrong';

export const invalidLoginCredentials = (): URLSearchParams =>
  newToastSearchParams({ type: 'error', message: 'Invalid login credentials' });

export const newSomethingWentWrongToast = (): URLSearchParams =>
  newToastSearchParams({ type: 'error', message: 'Something went wrong' });

export const newBeAdminFirstToast = (): URLSearchParams =>
  newToastSearchParams({ type: 'error', message: 'You must be an admin' });

export const newAlreadySignedOutToast = (): URLSearchParams =>
  newToastSearchParams({ type: 'error', message: 'You are already signed out' });

export const newAlreadySignInToast = (): URLSearchParams =>
  newToastSearchParams({ type: 'info', message: 'You are already signed in' });

export const newSignedInToast = (): URLSearchParams =>
  newToastSearchParams({ type: 'success', message: 'You are now signed in' });

export const newSignInFirstToast = (): URLSearchParams =>
  newToastSearchParams({ type: 'info', message: 'You have to sign in first' });
