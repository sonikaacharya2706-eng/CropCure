/**
 * Safe API client helper that prevents:
 * SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
 * when an endpoint returns HTML (e.g. from Vite SPA fallback, 404, or proxy errors).
 */

export async function fetchJson<T>(
  url: string,
  options?: RequestInit,
  fallbackData?: T
): Promise<T> {
  try {
    const res = await fetch(url, options);

    // If server responded with error code
    if (!res.ok) {
      console.warn(`API ${url} returned status ${res.status}`);
      if (fallbackData !== undefined) return fallbackData;
      throw new Error(`HTTP error ${res.status}`);
    }

    // Verify content type is actually JSON before parsing
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      console.warn(`API ${url} returned non-JSON content-type: "${contentType}". Body starts with: "${text.slice(0, 50)}"`);
      if (fallbackData !== undefined) return fallbackData;
      throw new Error('Server returned non-JSON response');
    }

    const data = await res.json();
    return data as T;
  } catch (err: any) {
    console.warn(`fetchJson failed for ${url}:`, err?.message || err);
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw err;
  }
}
