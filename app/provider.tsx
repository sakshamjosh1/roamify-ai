"use client";
import React, { createContext, useContext, useEffect } from 'react';
import Header from './_components/Header';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

export const UserDetailContext = createContext<{userDetail: any, setUserDetail: React.Dispatch<any>} | undefined>(undefined);

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const CreateUser=useMutation(api.user.CreateNewUser)
  const [userDetail,setUserDetail]=useState<any>();
  const {user}=useUser();


  useEffect(()=>{
    user&&CreateNewUser();
  }, [user])

  const CreateNewUser = async () => {
    if(user){
      // save new user if doesnt exist
        const result=await  CreateUser({
        email:user?.primaryEmailAddress?.emailAddress ?? '',
        imageUrl:user?.imageUrl,
        name:user?.fullName ?? ''
      });
      setUserDetail(result);
    }
    
    
  }

  return (
    <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
      <div>
          <Header/> 
          {children}
      </div>
    </UserDetailContext.Provider>
  )
}

export default Provider

export const useUserDetail = () => {
  return useContext(UserDetailContext);
}

