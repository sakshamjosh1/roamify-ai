// app/api/aimodel/route.ts

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { aj } from "../../../lib/arcjet";
import { auth, currentUser } from "@clerk/nextjs/server";

// 💡 SLIGHTLY SIMPLIFIED PROMPT, MAINTAINING STRICT JSON AND UI MAPPING
const PROMPT = `You are an AI Trip Planner Agent. Your goal is to collect trip details by asking one relevant question at a time.

You MUST follow these rules for EVERY response:
1. Respond ONLY with a single, strict JSON object. DO NOT include any extra text, commentary, code, or tags outside the JSON.
2. The JSON schema is: { "resp": "The next conversational question to the user.", "ui": "The corresponding UI component key or 'text'" }
3. Ask questions in this exact sequential order and use the specified 'ui' key:
   - 1. Starting location (ui: 'text')
   - 2. Destination (ui: 'text')
   - 3. Group size (ui: 'groupSize')
   - 4. Budget (ui: 'budget')
   - 5. Trip duration (ui: 'TripDuration')
   - 6. Travel interests (ui: 'text')
   - 7. Special requirements (ui: 'text')
4. When all information is collected, set 'ui' to 'final' and provide the trip plan in the 'resp' field.`;

const FINAL_PROMPT = `HARD REQUIREMENTS:
- You MUST return at least 3 hotels in "hotels".
- You MUST generate itinerary entries for EVERY day in "duration".
- Each day MUST contain at least 3 activities.
- Do NOT skip any day.
- Do NOT return partial results.
- Output ONLY valid JSON. No text outside JSON.
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
}`;

export async function POST(req: NextRequest) {
  const { messages, isFinal } = await req.json();

  const user = await currentUser();
  const { has } = await auth();
  const hasPremiumAccess = has({ plan: "monthly" });

  const decision = await aj.protect(req, {
    userId: user?.primaryEmailAddress?.emailAddress ?? "",
    requested: isFinal ? 5 : 0,
  });

  // @ts-ignore
  if (decision?.reason?.remaining === 0 && !hasPremiumAccess) {
    return NextResponse.json({
      resp: "Your Daily Limit Reached",
      ui: "limit",
    });
  }

  // ✅ CREATE OPENAI CLIENT INSIDE HANDLER (THIS FIXES BUILD)
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      "X-Title": "Roamify AI",
    },
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [
        {
          role: "system",
          content: isFinal ? FINAL_PROMPT : PROMPT,
        },
        ...messages,
      ],
      temperature: 0.0,
      response_format: { type: "json_object" },
    });

    const message = completion.choices?.[0]?.message;

    if (!message?.content) {
      return NextResponse.json(
        { resp: "No response from AI model.", ui: "text" },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(message.content);
      if (!parsed.resp) parsed.resp = "Please continue with the trip details.";
      if (!parsed.ui) parsed.ui = "text";
    } catch {
      parsed = { resp: message.content, ui: "text" };
    }

    return NextResponse.json(parsed);
  } catch (e: any) {
    if (e?.status === 402) {
      return NextResponse.json(
        {
          resp: "⚠️ AI usage limit reached. Please try again later.",
          ui: "text",
        },
        { status: 402 }
      );
    }

    return NextResponse.json(
      {
        resp: "An unexpected error occurred while communicating with the AI.",
        ui: "text",
      },
      { status: 500 }
    );
  }
}
