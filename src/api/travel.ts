import axios from "axios";
import { API_URL } from "./config";
import { TravelData } from "../types/travel";

const endpoint = "travel";

export const getAllTravels = async (): Promise<TravelData[]> => {
  return (await axios.get(`${API_URL}${endpoint}`)).data;
};

export const getOneTravel = async (id: string): Promise<TravelData> => {
  return (await axios.get(`${API_URL}${endpoint}/${id}`)).data;
};

export const createTravel = async (travel: TravelData): Promise<TravelData> => {
  return (await axios.post(`${API_URL}${endpoint}/add`, travel)).data;
};

export const updateTravel = async (travel: TravelData): Promise<TravelData> => {
  return (
    await axios.post(`${API_URL}${endpoint}/update/${travel._id}`, travel)
  ).data;
};

export const endTravel = async (travel: TravelData): Promise<TravelData> => {
  const elapsedTravelTime = Math.round(
    (Date.now() - new Date(travel.travel_departure ?? "").getTime()) / 1000 / 60
  );
  const travelData: TravelData = {
    ...travel,
    travel_status: "completed",
    travel_elapsed_time: elapsedTravelTime.toString(),
    travel_arrival: String(new Date()),
  };
  return (
    await axios.post(
      `${API_URL}${endpoint}/update/${travelData._id}`,
      travelData
    )
  ).data;
};
