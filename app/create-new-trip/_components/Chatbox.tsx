"use client";

import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import axios from "axios";

import EmptyState from "./EmptyState";
import GroupSizeUI from "./GroupSizeUI";
import BudgetUI from "./BudgetUI";
import TripDurationUI from "./TripDurationUI";
import FinalItineraryUI from "./FinalItineraryUI";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { useTripDetail } from "@/app/provider";

// ---------------- Types ----------------
type Message = {
  role: string;
  content: string;
  ui?: string;
};

export type TripInfo = {
  budget: string;
  destination: string;
  duration: string;
  group_size: string;
  origin: string;
  hotels: Hotel[];
  itinerary: Itinerary;
};

export type Hotel={
  hotel_name:string;
  hotel_address:string;
  price_per_night:string;
  geo_coordinates: {
    latitude:number;
    longitude:number;
  };
  rating:number;
  description: string;
};

export type Activity={
  place_name: string;
  place_details: string;
  place_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  place_address: string;
  ticket_pricing: string;
  time_travel_each_location: string;
  best_time_to_visit: string;
}

type Itinerary={
  day:number;
  day_plan:string;
  best_time_to_visit_day: string;
  activities: Activity[];
}

// ---------------- Helpers ----------------

// Remove any createdAt recursively
function removeCreatedAt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(removeCreatedAt);

  if (typeof obj === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(obj)) {
      if (k === "createdAt") continue;
      out[k] = removeCreatedAt(v);
    }
    return out;
  }

  return obj;
}

// Deep JSON sanitize (TypeScript-safe)
function sanitize<T>(obj: T): T | null {
  if (!obj || typeof obj !== "object") return null;

  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return null;
  }
}

// ---------------- Component ----------------

export default function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isFinal, setIsFinal] = useState(false);
  const [tripDetail, setTripDetail] = useState<TripInfo | undefined>();
  //@ts-ignore
  const {tripDetailInfo, setTripDetailInfo} = useTripDetail();

  // ✅ NEW (safe, additive)
  const [tripStatus, setTripStatus] = useState<
    "idle" | "created" | "updated"
  >("idle");
  const [changeSummary, setChangeSummary] = useState<string | null>(null);

  // Add a loading state
  const [isLoading, setIsLoading] = useState(false);

  // Clerk
  const { user, isLoaded } = useUser();

  const getUserByClerkId = useQuery(
    api.user.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const saveTripDetail = useMutation(api.tripDetail.createTripDetail);

  // ---------------- Main Send Handler ----------------
  const onSend = async (messageToSend?: string) => {
    const input = messageToSend ?? userInput;
    if (!messageToSend) setUserInput("");

    const newMsg: Message = { role: "user", content: input };
    const history = [...messages, newMsg];
    setMessages(history);

    setIsLoading(true); // Start loading

    try {
      const res = await axios.post("/api/aimodel", {
        messages: history,
        isFinal,
      });

      const plan = res.data.trip_plan || null;

      console.log("AI response:", res.data);

      setTripDetailInfo(res?.data?.trip_plan)

      if (!isFinal) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.data.resp,
            ui: res.data.ui,
          },
        ]);
        return;
      }

      if (!plan) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "❌ Trip generation failed. Please try again.",
          },
        ]);
        return;
      }

      const cleanedTrip = sanitize<TripInfo>(plan);
      if (!cleanedTrip) return;

      // ✅ Detect update vs create
      const isUpdate = !!tripDetail;

      setTripDetail(cleanedTrip);
      setTripStatus(isUpdate ? "updated" : "created");
      setChangeSummary(
        isUpdate
          ? "Your itinerary has been updated based on your request."
          : "Your trip is ready!"
      );

      if (!isLoaded || !user?.id) {
        console.warn(
          "Clerk not loaded or user not logged in — skipping save"
        );
        return;
      }

      const userTableDoc = getUserByClerkId;
      if (!userTableDoc) {
        console.error("User not found in UserTable");
        return;
      }

      const finalArgs = {
        tripId: uuidv4(),
        uid: userTableDoc._id,
        tripDetail: cleanedTrip,
      };

      console.log("Saving to Convex:", finalArgs);

      await saveTripDetail(finalArgs);

      // Ensure only one 'final' message is added
      setMessages((prev) => {
        const hasFinalMessage = prev.some((msg) => msg.ui === "final");
        if (hasFinalMessage) return prev;

        return [
          ...prev,
          {
            role: "assistant",
            content: isUpdate
              ? "✨ Itinerary updated! Your changes have been saved."
              : "✅ Trip created successfully!",
            ui: "final",
          },
        ];
      });

      console.log("✅ Trip saved to Convex");
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Saved the itinerary locally but failed to persist it to the database.",
        },
      ]);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // ---------------- UI Renderer ----------------
  const renderUI = (ui: string) => {
    if (ui === "budget") return <BudgetUI onSelectedOption={onSend} />;
    if (ui === "groupSize") return <GroupSizeUI onSelectedOption={onSend} />;
    if (ui === "TripDuration")
      return <TripDurationUI onSelectedOption={onSend} />;

    if (ui === "final") {
      const last = [...messages].reverse().find((m) => m.ui === "final");
      return (
        <FinalItineraryUI
          planningText={last?.content ?? "Planning your trip..."}
          isTripReady={!!tripDetail}
          tripStatus={tripStatus}        // ✅ NEW
          changeSummary={changeSummary}  // ✅ NEW
          onViewTrip={() => console.log("View Trip")}
          onSelectedOption={onSend}
        />
      );
    }
    return null;
  };

  // ---------------- Effects ----------------
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.ui === "final") {
      setIsFinal(true);
      setUserInput("Ok, Great!");
    }
  }, [messages]);

  useEffect(() => {
    if (isFinal && userInput) onSend();
  }, [isFinal]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Add a function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  // Use useEffect to trigger scrolling when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ---------------- Render ----------------
  return (
    <div className="h-[85vh] flex flex-col border shadow rounded-2xl ">
      {messages.length === 0 && (
        <EmptyState onSelectOption={onSend} />
      )}

      <section className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "calc(85vh - 100px)", overflowY: "auto" }}>
        {messages.map((msg, i) =>
          msg.role === "user" ? (
            <div key={i} className="flex justify-end mt-4">
              <div className="bg-primary text-white px-4 py-2 rounded-xl">
                {msg.content}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-start mt-4">
              <div className="bg-gray-100 px-4 py-2 rounded-xl">
                {msg.content}
                {msg.ui && renderUI(msg.ui)}
              </div>
            </div>
          )
        )}
        {isLoading && (
          <div className="flex justify-start mt-4">
            <div className="bg-gray-100 px-4 py-2 rounded-xl flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Add this div to mark the end of messages */}
      </section>

      <section className="p-2">
        <div className="border rounded-2xl p-4 relative flex items-center">
          <Textarea
            placeholder="Create a trip from Paris to New York"
            value={userInput}
            className="pr-12 resize-none"
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
          <Button
            size="icon"
            className="absolute right-7 inset-y-0 my-auto"
            onClick={() => onSend()}
          >
            <Send size={16} />
          </Button>
        </div>
      </section>
    </div>
  );
}
