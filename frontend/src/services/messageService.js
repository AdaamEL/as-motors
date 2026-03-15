import axios from "axios";

const API_ROOT = process.env.REACT_APP_API_ROOT || "https://as-motors.onrender.com";
const API_URL = process.env.REACT_APP_API_URL || `${API_ROOT}/api`;

export const sendMessage = async (data) => {
  const res = await axios.post(`${API_URL}/messages`, data);
  return res.data;
};
