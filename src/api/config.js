import { getCookie } from "@/utils/getToken";
import { getCookieValue, getToken } from "@/utils/getTokenCookie";
import axios from "axios";

const BASE_URL = "https://ws.stage.cricap.com/api"; // staging server
// https://ws.stage.cricap.com/api/auth/local/register

// const auth = localStorage.getItem("auth");
// const userData = auth ? JSON.parse(auth) : null;
// const token = userData?.jwt;

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = getToken();
  console.log("this is token", token);

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
client.interceptors.request.use(
  async (config) => {
    const requestConfig = config;
    // const { authenticationToken } = store.getState().userSession;
    // console.log("Authorization Token--->", authenticationToken)
    // if (authenticationToken) {
    //   requestConfig.headers = {
    //     'Authorization': `Bearer ${authenticationToken.token}`,
    //   };
    // }
    // console.log('requestConfig----->', requestConfig)
    return requestConfig;
  },

  (err) => {
    // showErrorMsg(err);
    return Promise.reject(err);
  }
);

export { BASE_URL, client };
