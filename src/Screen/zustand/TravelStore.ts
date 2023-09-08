import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { produce } from "immer";
import { TravelData } from "../../types/travel";
import { createTravel, endTravel, updateTravel } from "../../api/travel";

interface TravelState {
  travels: TravelData[];
  currentTravel: TravelData | undefined;
  rider: string;
}

interface TravelActions {
  fetchTravels: () => void;
  createTravel: (travel: TravelData) => void;
  endTravel: (travel: TravelData) => void;
  deleteTravel?: (travel: TravelData) => void;
  setCurrentTravel: (travel: TravelData | undefined) => void;
}

const initialState: TravelState = {
  travels: [],
  rider: "",
  currentTravel: undefined,
};

type TravelStore = TravelState & TravelActions;

export const useTravelStore = create<TravelStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        fetchTravels: () => {},
        createTravel: async (travel: TravelData) => {
          try {
            const newTravel = await createTravel(travel);
            console.log(newTravel._id);
            set({ currentTravel: newTravel, rider: newTravel.travel_rider });
          } catch (err) {
            console.error(err);
          }
        },
        endTravel: async (travel: TravelData) => {
          try {
            const closedTravel = await endTravel(travel);
            set({ currentTravel: undefined });
          } catch (err) {
            console.error(err);
          }
        },
        deleteTravel: (travel: TravelData) => {},
        setCurrentTravel: (travel: TravelData | undefined) => {
          set({ currentTravel: travel });
        },
      }),
      {
        name: "jda-sending-storage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
