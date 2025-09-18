"use client"
import React, {useState} from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send } from "lucide-react";
import axios from 'axios';
import { Assistant } from 'next/font/google';
import EmptyState from './EmptyState';

type Message={
    role:string,
    content:string
}

function Chatbox() {

    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput]=useState<string>();
    const onSend=async ()=>{
        if(!userInput?.trim()) return;
        setUserInput('');
        const newMsg:Message={
            role:'user',
            content:userInput
        }

        setMessages((prev:Message[])=>[...prev,newMsg]);

        const result = await axios.post('/api/aimodel',{
            messages:[...messages,newMsg]
        });
        
        setMessages((prev:Message[])=>[...prev,{
            role:'assistant',
            content:result?.data?.resp
        }]);
        console.log(result.data);
    }

  return (

    <div className='h-[85vh] flex flex-col '>
        {messages?.length==0&&
        <EmptyState onSelectOption={(v:string)=>{setUserInput(v); onSend}}/>
        }
        {/* Display Messages */}
        <section className='flex-1 overflow-y-auto p-4'>
            {messages.map((msg:Message,index)=>(
                msg.role=='user'?
                <div className='flex justify-end mt-2' key={index}>
                    <div className='max-w-lg bg-primary text-white px-4 py-2 rounded-lg'>
                        {msg.content}
                    </div>
                </div> :
                <div className='flex justify-start mt-2' key={index}>
                    <div className='max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg'>
                        {msg.content}
                    </div>
                </div>
            ))}
            
        </section>
        {/* User Input */}
        <section>
            <div>
            <div className='border rounded-2xl p-4 shadow-2xs relative'>
                
                <Textarea placeholder="Create a trip from Paris to New York" className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
                onChange={(event)=>setUserInput(event.target.value??'')}
                value={userInput}
                />
                              
                <Button size="icon" className="absolute bottom-6 right-6 hover:cursor-pointer" onClick={onSend}>
                  <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
        </section>

    </div>
  )
}

export default Chatbox
