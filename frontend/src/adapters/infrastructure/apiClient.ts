const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function apiGet(path: string) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function apiPost(path: string, body: unknown) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}
