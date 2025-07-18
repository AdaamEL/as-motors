import axios from "axios";

const API_URL = "http://localhost:5000/api/messages";

export const sendMessage = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};
