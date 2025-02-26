export const removeFileExtension = (fileName: string): string => {
  const names = fileName.split('.');

  if (names.length >= 1) {
    return fileName.replace(`.${names[names.length - 1]}`, '');
  }

  return fileName;
};
