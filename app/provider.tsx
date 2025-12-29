"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type UserDetailType = {
  _id: string;
  clerkId: string;
  name: string;
  email: string;
  imageUrl: string;
} | null;

type UserDetailContextType = {
  userDetail: UserDetailType;
};

const UserDetailContext = createContext<UserDetailContextType | undefined>(undefined);

export const UserDetailProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const createUser = useMutation(api.user.createNewUser);
  const [userDetail, setUserDetail] = useState<UserDetailType>(null);

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
    <UserDetailContext.Provider value={{ userDetail }}>
      {children}
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
