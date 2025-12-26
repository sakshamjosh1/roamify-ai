"use client";

import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import axios from "axios";
import EmptyState from "./EmptyState";
import GroupSizeUI from "./GroupSizeUI";
import BudgetUI from "./BudgetUI";
import TripDurationUI from "./TripDurationUI";
import FinalItineraryUI from "./FinalItineraryUI";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";

// ---------------- Types ----------------
type Message = {
  role: string;
  content: string;
  ui?: string;
};

type TripInfo = {
  budget: string;
  destination: string;
  duration: string;
  group_size: string;
  origin: string;
  hotels: any;
  itinerary: any;
};

// ---------------- Helpers ----------------

// Remove any `createdAt` recursively
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

// Deep JSON sanitize (kills Dates, functions, undefined)
function sanitize(obj: any) {
  return removeCreatedAt(JSON.parse(JSON.stringify(obj)));
}

// ---------------- Component ----------------

export default function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isFinal, setIsFinal] = useState(false);
  const [tripDetail, setTripDetail] = useState<TripInfo | undefined>();

  // Clerk
  const { user, isLoaded } = useUser();

  // Convex
  const saveTripDetail = useMutation(api.tripDetail.createTripDetail);

  // ---------------- Main Send Handler ----------------
  const onSend = async (messageToSend?: string) => {
    const input = messageToSend ?? userInput;
    if (!messageToSend) setUserInput("");

    const newMsg: Message = { role: "user", content: input };
    const history = [...messages, newMsg];
    setMessages(history);

    try {
      const res = await axios.post("/api/aimodel", {
        messages: history,
        isFinal,
      });

      console.log("AI response:", res.data);

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

      // ---------------- FINAL SAVE ----------------

      const cleanedTrip = sanitize(res.data.trip_plan);
      setTripDetail(cleanedTrip);

      // 🚨 CRITICAL FIX: WAIT FOR CLERK
      if (!isLoaded) {
        console.warn("Clerk not loaded yet — skipping save");
        return;
      }

      if (!user?.id) {
        console.warn("User not logged in — skipping save");
        return;
      }

      const finalArgs = sanitize({
        tripId: uuidv4(),
        uid: user.id,
        tripDetail: cleanedTrip,
      });

      console.log("Saving to Convex:", finalArgs);

      await saveTripDetail(finalArgs);

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
    }
  };

  // ---------------- UI Renderer ----------------
  const renderUI = (ui: string) => {
    if (ui === "budget") return <BudgetUI onSelectedOption={onSend} />;
    if (ui === "groupSize") return <GroupSizeUI onSelectedOption={onSend} />;
    if (ui === "TripDuration") return <TripDurationUI onSelectedOption={onSend} />;
    if (ui === "final") {
      const last = [...messages].reverse().find((m) => m.ui === "final");
      return (
        <FinalItineraryUI
          planningText={last?.content ?? "Planning your trip..."}
          isTripReady={!!tripDetail}
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

  // ---------------- Render ----------------
  return (
    <div className="h-[85vh] flex flex-col">
      {messages.length === 0 && <EmptyState onSelectOption={onSend} />}

      <section className="flex-1 overflow-y-auto p-4">
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
      </section>

      <section className="p-2">
        <div className="border rounded-2xl p-4 relative">
          <Textarea
            placeholder="Create a trip from Paris to New York"
            value={userInput}
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
            className="absolute bottom-4 right-4"
            onClick={() => onSend()}
          >
            <Send size={16} />
          </Button>
        </div>
      </section>
    </div>
  );
}
