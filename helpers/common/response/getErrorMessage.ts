import { SOMETHING_WENT_WRONG } from '../toast/newToastSearchParams';
import { isErrorResponse } from './ErrorResponse';

export const getErrorMessage = async (response: Response): Promise<string> => {
  if (response.status == 429) {
    const errorResponse = await response.json();
    if (isErrorResponse(errorResponse)) {
      return errorResponse?.errors[0]?.message ?? SOMETHING_WENT_WRONG;
    }
  }

  return SOMETHING_WENT_WRONG;
};
