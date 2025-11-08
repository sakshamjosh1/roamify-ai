// chatbox.tsx

"use client"
import React, { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send } from "lucide-react";
import axios from 'axios';
import EmptyState from './EmptyState';
import GroupSizeUI from './GroupSizeUI';
import BudgetUI from './BudgetUI';
import TripDurationUI from './TripDurationUI';
import FinalItineraryUI from './FinalItineraryUI';

// Define the Message type
type Message = {
    role: string,
    content: string
    ui?: string,
}

function Chatbox() {

    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    
    // onSend handles both text input and UI component clicks
    const onSend = async (messageToSend?: string) => {
        
        const input = messageToSend || userInput;
        if (!input?.trim()) return;

        // 1. Clear the input field only if sending from the text box
        if (!messageToSend) {
            setUserInput('');
        }

        // 2. Define the new user message
        const newMsg: Message = {
            role: 'user',
            content: input
        }
        
        // 3. CRITICAL FIX: Create the complete message history for the API call *first*.
        const completeHistory: Message[] = [...messages, newMsg];

        // 4. Update the component state with the new user message.
        setMessages(completeHistory); 

        // 5. Send the COMPLETE message history to the API.
        try {
            const result = await axios.post('/api/aimodel', {
                messages: completeHistory
            });

            // 6. Update state with the assistant's response
            setMessages((prev: Message[]) => [...prev, {
                role: 'assistant',
                content: result?.data?.resp,
                ui: result.data?.ui
            }]);

        } catch (error) {
            console.error("Error calling AI model API:", error);
            // Display an error message if the API failed (Status 500)
            setMessages((prev: Message[]) => [...prev, {
                role: 'assistant',
                content: "Sorry, I ran into an error connecting to the AI. Please try again."
            }]);
        }
    }

    const RenderGenerativeUI = (ui: string) => {
        if (ui === 'budget') {
            return <BudgetUI onSelectedOption={(v: string) => onSend(v)} />
        }
        else if (ui === 'groupSize') {
            return <GroupSizeUI onSelectedOption={(v: string) => onSend(v)} />
        }
        // 💡 FIX: The AI will ask for 'TripDuration' next. Since you don't have a specific component for it,
        // we return null to allow the default text input to handle the response.
        else if (ui === 'TripDuration') { 
            return <TripDurationUI onSelectedOption={(v: string) => onSend(v)} />
        }
        // If the AI returns 'text' or 'final', we also return null to let the text input handle it.
        else if (ui === 'final') {
             return <FinalItineraryUI onSelectedOption={(v: string) => onSend(v)} />
             return null;
        }
        return null;
    }

    
    return (

        <div className='h-[85vh] flex flex-col '>
            {/* EmptyState logic */}
            {messages?.length === 0 &&
                <EmptyState onSelectOption={(v: string) => {
                    onSend(v);
                }}/>
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
                    
                    <Textarea placeholder="Create a trip from Paris to New York" 
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
                                        
                    <Button size="icon" className="absolute bottom-6 right-6 hover:cursor-pointer bg-primary" onClick={() => onSend()}>
                      <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            </section>

        </div>
    )
}

export default Chatbox