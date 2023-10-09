export function addBase64Prefix(imageExtension: string, base64: string) {
  return `data:image/${imageExtension};base64,${base64}`;
}
