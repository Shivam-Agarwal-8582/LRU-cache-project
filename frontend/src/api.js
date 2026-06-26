// src/api.js
// Simple wrapper for the Spring Boot cache REST API.
// Adjust the BASE_URL if your backend runs on a different host/port.
const BASE_URL = 'http://localhost:8080';

/**
 * Store a key/value pair in the cache.
 * @param {string} key
 * @param {string} value
 * @returns {Promise<object>} JSON response from the server.
 */
export async function putCache(key, value) {
  const response = await fetch(`${BASE_URL}/cache`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ key, value }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`PUT request failed: ${response.status} ${err}`);
  }
  return response.json();
}

/**
 * Retrieve a value from the cache.
 * @param {string} key
 * @returns {Promise<string|null>} The cached value or null if not found.
 */
export async function getCache(key) {
  const response = await fetch(`${BASE_URL}/cache/${encodeURIComponent(key)}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`GET request failed: ${response.status} ${err}`);
  }
  const data = await response.json();
  return data.value;
}
