import axios from "axios";
import { getCookie } from "cookies-next";
import { parseCookies } from "nookies";

// Helper function to get the token from cookies
export const getToken = () => {
  if (typeof window === "undefined") {
    // SSR - Use nookies for server-side cookies
    const cookies = parseCookies();
    console.log(cookies, "geting from server side");
    const auth = cookies["auth"];
    const token = JSON.parse(auth || "{}")?.jwt;
    return token;
  } else {
    // CSR - Access cookies directly on the client
    const cookies = getCookie("auth");
    console.log(JSON.parse((cookies as string) || "{}"), "geting from client side");
    return JSON.parse((cookies as string) || "{}")?.jwt;
  }
};

// Axios instance with conditional token logic
const apiClient = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default apiClient;
