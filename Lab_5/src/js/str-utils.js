export function isUpperCase(str) {
    return str.toUpperCase() === str;
  }
  
export function capitalize(string) {
  if (string === null) {
    return null;
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

