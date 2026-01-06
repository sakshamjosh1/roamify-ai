// route.tsx

import { NextRequest, NextResponse } from "next/server";

import OpenAI from 'openai';
export const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': '<YOUR_SITE_URL>',
        'X-Title': '<YOUR_SITE_NAME>',
    },
});

// 💡 SLIGHTLY SIMPLIFIED PROMPT, MAINTAINING STRICT JSON AND UI MAPPING
const PROMPT = `You are an AI Trip Planner Agent. Your goal is to collect trip details by asking one relevant question at a time.

You MUST follow these rules for EVERY response:
1. Respond ONLY with a single, strict JSON object. DO NOT include any extra text, commentary, code, or tags outside the JSON.
2. The JSON schema is: { "resp": "The next conversational question to the user.", "ui": "The corresponding UI component key or 'text'" }
3. Ask questions in this **exact sequential order** and use the specified 'ui' key:
   - 1. Starting location (ui: 'text')
   - 2. Destination (ui: 'text')
   - 3. Group size (ui: 'groupSize')
   - 4. Budget (ui: 'budget')
   - 5. Trip duration (ui: 'TripDuration')
   - 6. Travel interests (ui: 'text')
   - 7. Special requirements (ui: 'text')
4. When all information is collected, set 'ui' to 'final' and provide the trip plan in the 'resp' field.
`;

const FINAL_PROMPT = `Generate Travel Plan with give details, give me Hotels options list with HotelName, Hotel address, 
Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, 
Place Image Url, Geo Coordinates, Place address, ticket Pricing, Time travel each of the location , 
with each day plan with best time to visit in JSON format. 
Output Schema:
{
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",
        "geo_coordinates": {
          "latitude": "number",
          "longitude": "number"
        },
        "rating": "number",
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": "number",
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": {
              "latitude": "number",
              "longitude": "number"
            },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  }
}`

export async function POST( req: NextRequest){
    const {messages, isFinal} = await req.json();

    // Removed the explicit API key check as the error likely lies elsewhere based on your feedback.

    try {
        const completion = await openai.chat.completions.create({
            // 💡 FIX: Using the model name that was previously working for network stability
            model: 'openai/gpt-3.5-turbo', 
            messages: [
                {
                    role: 'system',
                    content: isFinal?FINAL_PROMPT:PROMPT
                },
                ...messages
            ],
            temperature: 0.0, 
            // 💥 KEEP: Enforce strict JSON output for reliable Generative UI
            response_format: { type: "json_object" }, 
            
        });
        
        const message = completion.choices?.[0]?.message;

        if (!message?.content) {
            console.error("No content in model response:", completion);
            return NextResponse.json({ error: "No content from model" });
        }

        let parsed;
        try {
            // Simple, reliable JSON parsing due to 'response_format' enforcement
            parsed = JSON.parse(message.content);
            
            // Basic validation fallback
            if (!parsed.resp) { parsed.resp = "Please continue with the trip details."; }
            if (!parsed.ui) { parsed.ui = "text"; }
            
        } catch (err) {
            console.warn("Model returned unparseable content. Returning raw text.", err);
            // Fall back to showing the raw text
            parsed = { resp: message.content, ui: "text" };
        }

        return NextResponse.json(parsed);

    } catch(e) {
        // This catch block handles network errors or other API exceptions
        console.error("API call failed during execution:", e);
        if (e?.status === 402 || e?.code === 402) {
          return NextResponse.json(
            {
              resp: "⚠️ AI usage limit reached. Please try again later.",
              ui: "text",
            },
            { status: 402 }
          );
        }
        // Returning status 500 will trigger the user-friendly error message in Chatbox.tsx
        return NextResponse.json(
          { resp: "An unexpected error occurred while communicating with the AI. Check server logs.", ui: "text" }, 
          { status: 500 });
    }
}