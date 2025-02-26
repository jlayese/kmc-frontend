import type { SearchParams } from './SearchParams';

export const getSearchParam = (searchParams: SearchParams | undefined, key: string): string | undefined => {
  const param = searchParams?.[key];
  return typeof param == 'string' ? param : undefined;
};
