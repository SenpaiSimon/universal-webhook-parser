type TemplateData = Record<string, any>;

/**
 * Replaces placeholders like {data.key1} with actual values from an object.
 */
export function resolveTemplate(template: string, data: TemplateData): string {
  // Regex explains: find "{", capture everything until "}", then find "}"
  const regex = /\{([^}]+)\}/g;

  return template.replace(regex, (match, path: string) => {
    // Split "data.key1" into ["data", "key1"]
    const keys = path.split('.');
    
    // Reduce the object down to the specific value
    const result = keys.reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : undefined;
    }, data);

    // Return the value found, or the original {match} if not found.
    if (result === undefined) {
      return match;
    }
    if (typeof result === 'object' && result !== null) {
      return JSON.stringify(result, null, 2);
    }
    return String(result);
  });
}