import axios from "axios";

const httpRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  },
});

httpRequest.interceptors.request.use((config) => {
  return config;
});

httpRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default httpRequest;
