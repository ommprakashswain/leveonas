export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function mergeHeaders(
  base: Record<string, string>,
  custom?: Record<string, string>
): Record<string, string> {
  return { ...base, ...(custom || {}) };
}

export function logDebug(debug: boolean, message: string, ...args: any[]) {
  if (debug) {
    console.debug(`[Leveonas SDK] ${message}`, ...args);
  }
}
