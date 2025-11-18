// app/provider.tsx
"use client";
import React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, createContext, useContext } from "react";

type UserDetailType = {
  _id?: string;
  name?: string;
  email?: string;
  imageUrl?: string;
} | null;

type UserDetailContextType = {
  userDetail: UserDetailType;
  setUserDetail: React.Dispatch<React.SetStateAction<UserDetailType>>;
};

const UserDetailContext = createContext<UserDetailContextType | undefined>(undefined);

export const UserDetailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const createUserMutation = useMutation(api.user.createNewUser /* adjust if needed */);
  const [userDetail, setUserDetail] = useState<UserDetailType>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      createNewUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const createNewUser = async () => {
    if (!user) return;
    try {
      const result = await createUserMutation({
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        imageUrl: user?.imageUrl ?? "",
        name: user?.fullName ?? ""
      });
      setUserDetail(result ?? null);
    } catch (err) {
      console.error("createNewUser failed:", err);
    }
  };

  // IMPORTANT: provider no longer renders UI chrome like Header.
  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
};

export const useUserDetail = (): UserDetailContextType => {
  const ctx = useContext(UserDetailContext);
  if (!ctx) {
    throw new Error("useUserDetail must be used within <UserDetailProvider>. Wrap your app in the provider.");
  }
  return ctx;
};
