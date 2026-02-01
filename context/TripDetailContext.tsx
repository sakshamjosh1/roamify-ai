import { TripInfo } from "@/app/create-new-trip/_components/Chatbox";
import { createContext } from "react";

export type TripContextType = {
  tripDetailInfo: TripInfo | null;
  setTripDetailInfo: React.Dispatch<React.SetStateAction<TripInfo | null>>;

  // ✅ STEP 1: UI state for Map ↔ Itinerary
  viewMode: "map" | "itinerary";
  setViewMode: React.Dispatch<
    React.SetStateAction<"map" | "itinerary">
  >;
};

export const TripDetailContext =
  createContext<TripContextType | undefined>(undefined);
