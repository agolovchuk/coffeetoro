export function searchValidator(term: string, value: string): boolean {
  return value.toLowerCase().includes(term.toLowerCase());
}
