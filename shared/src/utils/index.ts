export function formatDate(date: Date): string {
  return new Date(date).toISOString();
}

export function isValidUuid(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

export function sanitizeString(value: string): string {
  return value.replace(/[<>"']/g, '');
}
