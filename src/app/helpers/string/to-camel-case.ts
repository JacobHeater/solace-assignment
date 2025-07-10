export function toCamelCase(str: string): string {
  if (!str || typeof str !== "string") {
    return "";
  }

  const words = str.split(/[-_\s]+/);

  const camelCasedWords = words.map((word, index) => {
    if (index === 0) {
      return word.toLowerCase();
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
  });

  return camelCasedWords.join("");
}
