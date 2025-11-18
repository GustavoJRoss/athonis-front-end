import axios from "axios";
import { getToken } from "../auth/utils";

export const api = async () => {
  const token = await getToken();
  console.log(token);
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
  });
};
