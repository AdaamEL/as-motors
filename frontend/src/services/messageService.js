import axios from "axios";

const API_ROOT = process.env.REACT_APP_API_ROOT || "https://as-motors.onrender.com";
const CONFIGURED_API_URL = process.env.REACT_APP_API_URL || `${API_ROOT}/api`;
const API_URL = CONFIGURED_API_URL.includes("api.as-motors.com")
  ? "https://as-motors.onrender.com/api"
  : CONFIGURED_API_URL;

export const sendMessage = async (data) => {
  const res = await axios.post(`${API_URL}/messages`, data);
  return res.data;
};
