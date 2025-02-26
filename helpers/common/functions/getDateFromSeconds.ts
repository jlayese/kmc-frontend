// Convert seconds to Date object.
export const getDateFromSeconds = (seconds: number): Date => {
  const date = new Date(+0); // Unix epoch start.
  date.setSeconds(seconds);
  return date;
};
