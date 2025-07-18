import axios from "axios";

const API_URL = "https://as-motors.onrender.com/api/messages";

export const sendMessage = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};
