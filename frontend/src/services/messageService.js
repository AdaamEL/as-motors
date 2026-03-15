import axios from "axios";
import { API_URL } from "./api";

export const sendMessage = async (data) => {
  const res = await axios.post(`${API_URL}/contact`, data);
  return res.data;
};
