// Utility for handling authentication errors globally
export function handleAuthError(response) {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("dealerName");
    localStorage.removeItem("agenteNome");
    window.location.href = "/login";
    return true;
  }
  return false;
}
