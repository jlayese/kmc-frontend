export const addFileExtension = (filePath: string, fileName: string): string => {
  const names = fileName.split('.');

  if (names.length >= 1) {
    return `${filePath}.${names[names.length - 1]}`;
  }

  return filePath;
};
