"use client"
import React, { useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send } from "lucide-react";
import axios from 'axios';
import EmptyState from './EmptyState';
import GroupSizeUI from './GroupSizeUI';
import BudgetUI from './BudgetUI';
import TripDurationUI from './TripDurationUI';
import FinalItineraryUI from './FinalItineraryUI';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUserDetail } from '@/app/provider';
import { v4 as uuidv4 } from 'uuid';

// Define the Message type
type Message = {
  role: string,
  content: string
  ui?: string,
}

type TripInfo = {
  budget: string,
  destination: string,
  duration: string,
  group_size: string,
  origin: string,
  hotels: any,
  itinerary: any
}

function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isFinal, setIsFinal] = useState(false);
  const [tripDetail, setTripDetail] = useState<TripInfo | undefined>();

  // ---- FIX: use a camelCase mutation variable and the correct generated api path ----
  // Adjust the path below if your generated file uses a different path (check /convex/_generated/api.ts)
  const saveTripDetail = useMutation(api.tripDetail.createTripDetail);

  // ---- FIX: call hook ONCE and destructure the return value ----
  // If your provider returns an object: use object destructuring (below).
  // If your provider returns an array, change to: const [userDetail, setUserDetail] = useUserDetail();
  const { userDetail, setUserDetail } = useUserDetail();

  // onSend handles both text input and UI component clicks
  const onSend = async (messageToSend?: string) => {
    const input = messageToSend || userInput;

    // Clear the input field only if sending from the text box
    if (!messageToSend) {
      setUserInput('');
    }

    // Define the new user message
    const newMsg: Message = {
      role: 'user',
      content: input
    }

    // Create the complete message history for the API call first
    const completeHistory: Message[] = [...messages, newMsg];

    // Update the component state with the new user message.
    setMessages(completeHistory);

    // Send the COMPLETE message history to the API.
    try {
      const result = await axios.post('/api/aimodel', {
        messages: completeHistory,
        isFinal: isFinal
      });

      console.log("TRIP", result.data);

      // Update state with the assistant's response
      if (!isFinal) {
        setMessages((prev: Message[]) => [
          ...prev,
          {
            role: 'assistant',
            content: result?.data?.resp,
            ui: result.data?.ui
          }
        ]);
      }

      if (isFinal) {
        setTripDetail(result?.data?.trip_plan);

        // defensive: ensure the mutation exists and user id is present
        if (typeof saveTripDetail === 'function') {
          const tripId = uuidv4();
          const uid = userDetail?._id ?? '';

          try {
            // only attempt save if we have a uid (you can remove this guard if guest saves are allowed)
            if (uid) {
              await saveTripDetail({
                tripDetail: result?.data?.trip_plan,
                tripId,
                uid
              });
            } else {
              console.warn('No user id present — skipping saveTripDetail (guest user)');
            }
          } catch (convexErr) {
            console.error('Error saving trip detail to Convex:', convexErr);
          }
        } else {
          console.warn('saveTripDetail mutation is not a function. Check the generated api path.');
        }
      }
    } catch (error) {
      console.error("Error calling AI model API:", error);
      // Display an error message if the API failed
      setMessages((prev: Message[]) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I ran into an error connecting to the AI. Please try again."
        }
      ]);
    }
  }

  const RenderGenerativeUI = (ui: string) => {
    if (ui === 'budget') {
      return <BudgetUI onSelectedOption={(v: string) => onSend(v)} />
    } else if (ui === 'groupSize') {
      return <GroupSizeUI onSelectedOption={(v: string) => onSend(v)} />
    } else if (ui === 'TripDuration') {
      return <TripDurationUI onSelectedOption={(v: string) => onSend(v)} />
    } else if (ui === 'final') {
      // Use the most recent assistant message with this UI as the planning text
      const lastAssistantWithUI =
        [...messages].reverse().find(m => m.role === 'assistant' && m.ui === 'final');
      const planningText =
        lastAssistantWithUI?.content ?? "Planning your dream trip...";

      return (
        <FinalItineraryUI
          planningText={planningText}
          isTripReady={Boolean(tripDetail)}     // ← controls disabled/enabled state
          onViewTrip={() => console.log('View Trip clicked')}
          onSelectedOption={(v: string) => onSend(v)}
        />
      );
    }
    return null;
  }

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.ui === 'final') {
      setIsFinal(true);
      setUserInput('Ok, Great!');
    }
  }, [messages])

  useEffect(() => {
    if (isFinal && userInput) {
      onSend();
      console.log('Final stage');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinal]);

  return (
    <div className='h-[85vh] flex flex-col '>
      {/* EmptyState logic */}
      {messages?.length === 0 &&
        <EmptyState onSelectOption={(v: string) => {
          onSend(v);
        }} />
      }

      {/* Display Messages */}
      <section className='flex-1 overflow-y-auto p-4'>
        {messages.map((msg: Message, index) => (
          msg.role === 'user' ? (
            <div className='flex justify-end mt-5' key={index}>
              <div className='max-w-lg bg-primary text-white px-4 py-2 rounded-xl rounded-tr-sm shadow-md'>
                {msg.content}
              </div>
            </div>
          ) : (
            <div className='flex justify-start mt-2' key={index}>
              {/* Assistant Message Bubble */}
              <div className='max-w-lg bg-gray-100 text-black px-4 py-2 rounded-xl rounded-tl-sm shadow-md'>
                {msg.content}
                {/* Render UI if 'ui' key is present */}
                {msg.ui && RenderGenerativeUI(msg.ui)}
              </div>
            </div>
          )
        ))}
      </section>

      {/* User Input */}
      <section>
        <div className='p-2'>
          <div className='border rounded-2xl p-4 shadow-xl relative'>
            <Textarea
              placeholder="Create a trip from Paris to New York"
              className="w-full h-20 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none pr-12"
              onChange={(event) => setUserInput(event.target.value ?? '')}
              value={userInput}
              onKeyDown={(e) => {
                // Allows sending on Enter key press without Shift
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
            />

            <Button
              size="icon"
              className="absolute bottom-6 right-6 hover:cursor-pointer bg-primary"
              onClick={() => onSend()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Chatbox
