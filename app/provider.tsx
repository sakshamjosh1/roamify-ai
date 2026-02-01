"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TripContextType, TripDetailContext } from "@/context/TripDetailContext";
import { TripInfo } from "./create-new-trip/_components/Chatbox";

type UserDetailType = {
  _id: string;
  clerkId: string;
  name: string;
  email: string;
  imageUrl: string;
} | null;

type UserDetailContextType = {
  userDetail: UserDetailType;
  setUserDetail: (detail: UserDetailType) => void; // Add this line
};

const UserDetailContext = createContext<UserDetailContextType | undefined>(undefined);


export const UserDetailProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const createUser = useMutation(api.user.createNewUser);
  const [userDetail, setUserDetail] = useState<UserDetailType>(null);
  const [tripDetailInfo, setTripDetailInfo] = useState<TripInfo | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "itinerary">("map");


  useEffect(() => {
    if (!isLoaded || !user) return;

    const syncUser = async () => {
      const dbUser = await createUser({
        clerkId: user.id,
        name: user.fullName ?? "",
        email: user.primaryEmailAddress?.emailAddress ?? "",
        imageUrl: user.imageUrl ?? "",
      });

      setUserDetail(dbUser);
    };

    syncUser();
  }, [isLoaded, user, createUser]);



  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <TripDetailContext.Provider
  value={{
    tripDetailInfo,
    setTripDetailInfo,
    viewMode,
    setViewMode,
  }}
>
  {children}
</TripDetailContext.Provider>

    </UserDetailContext.Provider>
  );
};

export const useUserDetail = () => {
  const ctx = useContext(UserDetailContext);
  if (!ctx) {
    throw new Error("useUserDetail must be used within UserDetailProvider");
  }
  return ctx;
};

export const useTripDetail = (): TripContextType => {
  const ctx = useContext(TripDetailContext);
  if (!ctx) {
    throw new Error("useTripDetail must be used within a TripDetailProvider");
  }
  return ctx;
};