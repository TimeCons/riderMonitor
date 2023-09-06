const TIME_ADDRESS = "Via Giusti 128, Calenzano, 50041, Firenze";
const GOOGLE_API_KEY = "AIzaSyBs3t_6Ub7T_OTM_23iSydgOnq4OAlI7Kk";

export const getDistanceMatrix = async (destinationAddress: string) => {
  try {
    const encodedOrigin = encodeURI(TIME_ADDRESS);
    const encodedDestination = encodeURI(destinationAddress);

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodedOrigin}&destinations=${encodedDestination}&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Distance Matrix API returned an error: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Distance Matrix API Response:", data);
    return data;
  } catch (error) {
    console.error("Error while fetching Distance Matrix API:", error);
    throw error;
  }
};
