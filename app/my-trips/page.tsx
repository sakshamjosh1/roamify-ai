"use client"
import React, { useContext, useEffect, useState } from 'react'
import Header from '../_components/Header'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUserDetail } from '../provider';

function MyTrips() {
  const [myTrips,setMyTrips]=useState([]);
  const {userDetail, setUserDetail}=useUserDetail();
  const convex = useConvex();

  useEffect(()=>{
    userDetail&&GetUserTrip();
  },[userDetail])

  const GetUserTrip=async()=>{
    const result=await convex.query(api.tripDetail.GetUserTrips,{
        //@ts-ignore
        uid:userDetail?._id
    });
    setUserDetail(result);
    console.log(result);
    
  }
  return (
    <>
        <Header/>
        <div className='px-10 p-10 md:px-24 lg:px-48'>
            <h2 className='font-bold text-3xl my-5 text-center'>My Trips</h2>
            {myTrips?.length==0&&
            <div className='p-7 border-rounted-2xl flex flex-col items-center justify-center gap-5 mt-6'>
                <h2>You don't have any trip plan created </h2>
                <Link href={'/create-new-trip'}>
                    <Button className='hover:cursor-pointer'>Create New Trip</Button>
                </Link>
            </div>
            }
        </div>
    </>
  )
}

export default MyTrips
