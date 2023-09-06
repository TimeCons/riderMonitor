import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { produce } from "immer";
import { TravelData } from "../../types/travel";

// find and replace Demo with store name

interface TravelState {
  travels: TravelData[];
}

interface TravelActions {
  fetchTravels?: () => void;
  addTravel?: (travel: TravelData) => void;
  updateTravel?: (travel: TravelData) => void;
  deleteTravel?: (travel: TravelData) => void;
}

const initialState: TravelState = {
  travels: [],
};

type TravelStore = TravelState & TravelActions;

export const useJDASendingStore = create<TravelStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        fetchTravels: () => {},
        addTravel: (travel: TravelData) => {},
        updateTravel: (travel: TravelData) => {},
      }),
      {
        name: "jda-sending-storage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
