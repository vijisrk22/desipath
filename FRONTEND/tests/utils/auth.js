import { request } from '@playwright/test';

/**
 * Logs in a user via the API and returns the access token.
 * Adjust the API endpoint and credentials to match your setup.
 */
async function loginViaApi(baseURL, email, password) {
  const apiContext = await request.newContext({ baseURL });
  const response = await apiContext.post('/api/login', {
    data: { email, password },
    headers: { 'Accept': 'application/json' }
  });

  if (!response.ok()) {
    throw new Error(`Failed to log in: ${response.status()} ${response.statusText()}`);
  }

  const data = await response.json();
  return data.access_token; // Assuming your API returns { access_token: "..." }
}

export { loginViaApi };
