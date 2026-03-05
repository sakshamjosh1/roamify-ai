"use client";

import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
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
import LimitReachedUI from "./LimitReachedUI";

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
  itinerary: Itinerary[];
};

export type Hotel = {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  geo_coordinates: { latitude: number; longitude: number };
  rating: number;
  description: string;
};

export type Activity = {
  place_name: string;
  place_details: string;
  place_image_url: string;
  geo_coordinates: { latitude: number; longitude: number };
  place_address: string;
  ticket_pricing: string;
  time_travel_each_location: string;
  best_time_to_visit: string;
};

export type Itinerary = {
  day: number;
  day_plan: string;
  best_time_to_visit_day: string;
  activities: Activity[];
};

// ---------------- Helpers ----------------
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

function sanitize<T>(obj: T): T | null {
  if (!obj || typeof obj !== "object") return null;
  try { return JSON.parse(JSON.stringify(obj)); }
  catch { return null; }
}

// ---------------- Component ----------------
export default function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isFinal, setIsFinal] = useState(false);
  const [tripDetail, setTripDetail] = useState<TripInfo | undefined>();
  //@ts-ignore
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  const [tripStatus, setTripStatus] = useState<"idle" | "created" | "updated">("idle");
  const [changeSummary, setChangeSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    try {
      const res = await axios.post("/api/aimodel", { messages: history, isFinal });
      const plan = res.data.trip_plan || null;
      setTripDetailInfo(res?.data?.trip_plan);

      if (!isFinal) {
        setMessages((prev) => [...prev, { role: "assistant", content: res.data.resp, ui: res.data.ui }]);
        return;
      }

      if (!plan) {
        setMessages((prev) => [...prev, { role: "assistant", content: "❌ Trip generation failed. Please try again." }]);
        return;
      }

      const cleanedTrip = sanitize<TripInfo>(plan);
      if (!cleanedTrip) return;

      const isUpdate = !!tripDetail;
      setTripDetail(cleanedTrip);
      setTripStatus(isUpdate ? "updated" : "created");
      setChangeSummary(isUpdate ? "Your itinerary has been updated." : "Your trip is ready!");

      if (!isLoaded || !user?.id) return;
      const userTableDoc = getUserByClerkId;
      if (!userTableDoc) return;

      await saveTripDetail({ tripId: uuidv4(), uid: userTableDoc._id, tripDetail: cleanedTrip });

      setMessages((prev) => {
        const hasFinalMessage = prev.some((msg) => msg.ui === "final");
        if (hasFinalMessage) return prev;
        return [...prev, {
          role: "assistant",
          content: isUpdate ? "✨ Itinerary updated!" : "✅ Trip created successfully!",
          ui: "final",
        }];
      });
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Saved locally but failed to persist to the database." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- UI Renderer ----------------



  const renderUI = (ui: string) => {
    if (ui === "budget") return <BudgetUI onSelectedOption={onSend} />;
    if (ui === "groupSize") return <GroupSizeUI onSelectedOption={onSend} />;
    if (ui === "TripDuration") return <TripDurationUI onSelectedOption={onSend} />;
    if (ui === "limit") return <LimitReachedUI />;   // ← ADD THIS LINE
    if (ui === "budget") return <BudgetUI onSelectedOption={onSend} />;
    if (ui === "groupSize") return <GroupSizeUI onSelectedOption={onSend} />;
    if (ui === "TripDuration") return <TripDurationUI onSelectedOption={onSend} />;
    if (ui === "final") {
      const last = [...messages].reverse().find((m) => m.ui === "final");
      return (
        <FinalItineraryUI
          planningText={last?.content ?? "Planning your trip..."}
          isTripReady={!!tripDetail}
          tripStatus={tripStatus}
          changeSummary={changeSummary}
        />
      );
    }
    return null;
  };

  // ---------------- Effects ----------------
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.ui === "final") { setIsFinal(true); setUserInput("Ok, Great!"); }
  }, [messages]);

  useEffect(() => {
  if (isFinal && userInput && !hasSentFinal.current) {
    hasSentFinal.current = true;
    onSend();
  }
}, [isFinal]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const hasSentFinal = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  // ---------------- Render ----------------
  return (
    <div className="flex flex-col h-full">

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        {messages.length === 0 && <EmptyState onSelectOption={onSend} />}

        {messages.map((msg, i) =>
          msg.role === "user" ? (
            // User bubble — right aligned
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] bg-gray-900 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm leading-relaxed">
                {msg.content}
              </div>
            </div>
          ) : (
            // AI bubble — left aligned
            <div key={i} className="flex justify-start gap-2.5">
              {/* AI avatar */}
              <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-orange-500 text-xs font-bold">R</span>
              </div>
              <div className="max-w-[85%]">
                <div className="bg-gray-100 text-gray-800 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm leading-relaxed">
                  {msg.content}
                </div>
                {msg.ui && (
                  <div className="mt-2">
                    {renderUI(msg.ui)}
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <span className="text-orange-500 text-xs font-bold">R</span>
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <div className="flex items-end gap-2 border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 focus-within:border-gray-400 focus-within:bg-white transition-all duration-150">
          <Textarea
            placeholder="Type your message…"
            value={userInput}
            className="flex-1 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none text-sm text-gray-800 placeholder:text-gray-400 min-h-[36px] max-h-[120px] py-1"
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
          <button
            onClick={() => onSend()}
            disabled={!userInput.trim()}
            className="w-8 h-8 flex items-center justify-center bg-gray-900 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-150 flex-shrink-0 mb-0.5"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mt-1.5 text-center">
          Press <kbd className="bg-gray-100 border border-gray-200 px-1 py-0.5 rounded text-[10px]">Enter</kbd> to send
        </p>
      </div>

    </div>
  );
}