import axios from "axios";
import { API_URL } from "./config";
import { TravelData } from "../types/travel";

const endpoint = "travel";

export const getAllTravels = async (): Promise<TravelData[]> => {
  return (await axios.get(`${API_URL}${endpoint}`)).data;
};

export const createTravel = async (travel: TravelData): Promise<TravelData> => {
  return (await axios.post(`${API_URL}${endpoint}/add`, travel)).data;
};

export const updateTravel = async (travel: TravelData): Promise<TravelData> => {
  return (
    await axios.post(`${API_URL}${endpoint}/update/${travel._id}`, travel)
  ).data;
};
