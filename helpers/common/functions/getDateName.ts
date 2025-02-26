import dayjs from 'dayjs';

export const getDateName = (): string => dayjs(new Date()).format('MMM D, YYYY, h:mm A');
