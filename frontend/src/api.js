export async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    const error = new Error(result.error?.message || 'The request could not be completed.');
    error.details = result.error?.details || [];
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
}

export function getErrorMessages(error) {
  return error.details?.length ? error.details : [error.message];
}
