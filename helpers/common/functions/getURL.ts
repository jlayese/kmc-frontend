export const getURL = (path: string = ''): string => {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  return path ? `${url}${path}` : url;
};
