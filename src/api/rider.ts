import { API_URL } from "./config";
import axios from "axios";

const endpoint = "rider";

export const getAllRiders = async () => {
  return await axios.get(`${API_URL}${endpoint}`);
};
