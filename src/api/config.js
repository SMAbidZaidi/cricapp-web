import { getCookie } from "@/utils/getToken";
import axios from "axios";

const BASE_URL = "https://ws.stage.cricap.com/api"; // staging server
// https://ws.stage.cricap.com/api/auth/local/register

// const auth = localStorage.getItem("auth");
// const userData = auth ? JSON.parse(auth) : null;
// const token = userData?.jwt;

const cookies = JSON.parse(getCookie("auth") || "{}");
const token = cookies?.jwt;

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    // Authorization: `Bearer ${token}`,
    // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsImlhdCI6MTcyNzY4ODE3NSwiZXhwIjoxNzMwMjgwMTc1fQ.GBa8pBWUqryhCchD9wCrhJx_qPpfJUeMjU2UDXEpSBc`,
  },
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
