// src/api.js
// Centralized API utility for authenticated requests

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function apiRequest(path, { method = "GET", body, headers = {}, ...rest } = {}) {
  const token = getToken();
  const fetchHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };
  if (token) {
    fetchHeaders["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: fetchHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });
  if (!response.ok) {
    // Try to parse error message
    let errorMsg = `API error: ${response.status}`;
    try {
      const errData = await response.json();
      errorMsg = errData.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  // Try to parse JSON, fallback to text
  try {
    return await response.json();
  } catch {
    return await response.text();
  }
}

export function get(path, options) {
  return apiRequest(path, { ...options, method: "GET" });
}

export function post(path, body, options) {
  return apiRequest(path, { ...options, method: "POST", body });
}

export function put(path, body, options) {
  return apiRequest(path, { ...options, method: "PUT", body });
}

export function del(path, options) {
  return apiRequest(path, { ...options, method: "DELETE" });
}

export default { get, post, put, del };
