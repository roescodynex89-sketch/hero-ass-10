import { authClient } from "./auth-client";

export const fetchWithAuth = async (endpoint, options = {}) => {
  //  const { data } = await authClient.getToken();

  const tokenRes = await authClient.token();
  const token = tokenRes?.data?.token;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
};
