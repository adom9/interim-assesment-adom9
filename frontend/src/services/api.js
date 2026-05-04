const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  };
  if (config.body && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }
  const response = await fetch(url, config);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

export const registerUser = (userData) =>
  request("/register", { method: "POST", body: userData });

export const loginUser = (credentials) =>
  request("/login", { method: "POST", body: credentials });

export const logoutUser = () =>
  request("/logout", { method: "POST" });

export const getUserProfile = () =>
  request("/profile", { method: "GET" });

export const getAllCrypto = () => request("/crypto");

export const getTopGainers = () => request("/crypto/gainers");

export const getNewListings = () => request("/crypto/new");

export const addCrypto = (cryptoData) =>
  request("/crypto", { method: "POST", body: cryptoData });