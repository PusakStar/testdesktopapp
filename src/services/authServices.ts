const API_URL = "http://localhost:3001/api";

export async function login(email: string, password: string) {
  return fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((res) => res.json());
}

export async function register(email: string, password: string) {
  return fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((res) => res.json());
}

export async function sendRecoveryCode(email: string) {
  return fetch(`${API_URL}/recover`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then((res) => res.json());
}

export async function verifyCode(email: string, code: string) {
  return fetch(`${API_URL}/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  }).then((res) => res.json());
}

export async function resetPassword(email: string, newPassword: string) {
  return fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  }).then((res) => res.json());
}
