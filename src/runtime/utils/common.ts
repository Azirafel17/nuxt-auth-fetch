export const stringToStringContainer = (
  str: string,
  separator: string = ','
): string[] => {
  return str
    .split(separator)
    .map((item) => item.trim())
    .filter((item) => item.length >= 1)
}
