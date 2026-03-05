// app/api/aimodel/route.ts

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { aj } from "../../../lib/arcjet";
import { auth, currentUser } from "@clerk/nextjs/server";

const PROMPT = `You are Roamify, a friendly AI travel planner. Collect trip details through natural conversation.

STRICT RULES:
1. ALWAYS respond with ONLY a single valid JSON object. No text or markdown outside the JSON.
2. JSON schema: { "resp": "your message", "ui": "component key" }
3. Collect these details one at a time in order:
   - Origin city          → ui: "text"
   - Destination          → ui: "text"
   - Group size           → ui: "groupSize"
   - Budget               → ui: "budget"
   - Trip duration        → ui: "TripDuration"
   - Travel interests     → ui: "text"
   - Special requirements → ui: "text"
4. Once ALL 7 details are collected, set ui to "final" and write a short friendly summary in "resp".
5. Keep responses to 1-2 sentences. Never repeat a question.`;

const FINAL_PROMPT = `You are a travel itinerary generator. Generate a complete trip plan from the details provided.

STRICT RULES:
- Return ONLY valid JSON. No text or markdown outside the JSON.
- Include at least 3 hotels.
- Include EVERY day of the trip with at least 3 activities each.
- All geo_coordinates must be real accurate numbers (not strings).
- price_per_night must be realistic (e.g. "₹4,500/night").
- rating must be a number between 1 and 5.

Output ONLY this JSON:
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
        "hotel_image_url": "",
        "geo_coordinates": { "latitude": 0.0, "longitude": 0.0 },
        "rating": 4.2,
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "",
            "geo_coordinates": { "latitude": 0.0, "longitude": 0.0 },
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

function extractTripSummary(messages: any[]): string {
  const conversation = messages
    .map((m: any) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");
  return `Extract trip details from this conversation and generate a full itinerary:\n\n${conversation}`;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGroqWithRetry(
  groq: Groq,
  systemPrompt: string,
  messages: any[],
  isFinal: boolean,
  retries = 3
): Promise<string | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: isFinal ? 0.3 : 0.7,
        response_format: { type: "json_object" },
        max_tokens: isFinal ? 10000 : 500,
      });

      const content = completion.choices?.[0]?.message?.content;
      const finishReason = completion.choices?.[0]?.finish_reason;

      console.log(`Attempt ${attempt} — finish_reason: ${finishReason}, content length: ${content?.length ?? 0}`);

      if (content && content.trim().length > 10) {
        return content;
      }

      // Empty response — wait and retry
      console.log(`Empty response on attempt ${attempt}, retrying in ${attempt * 2}s...`);
      await sleep(attempt * 2000);

    } catch (e: any) {
      if (e?.status === 429) {
        const waitTime = attempt * 5000;
        console.log(`Rate limited on attempt ${attempt}, waiting ${waitTime / 1000}s...`);
        await sleep(waitTime);
      } else {
        throw e;
      }
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const { messages, isFinal } = await req.json();

  const user = await currentUser();
  const { has } = await auth();
  const hasBasicAccess = has({ plan: "basic" });
  const hasProAccess = has({ plan: "pro" });
  const hasPremiumAccess = hasBasicAccess || hasProAccess;

 // REPLACE with:
const tokensToRequest = hasPremiumAccess
  ? 0        // paid users — never consume tokens
  : hasBasicAccess
  ? 0        // basic users — never consume tokens  
  : isFinal
  ? 10       // free users — each trip costs 10 tokens (= 2 trips/day with capacity 20)
  : 1;       // free users — each chat message costs 1 token

const decision = await aj.protect(req, {
  userId: user?.primaryEmailAddress?.emailAddress ?? "",
  requested: tokensToRequest,
});

if (decision.isDenied() && !hasPremiumAccess && !hasBasicAccess) {
  return NextResponse.json({ resp: "limit", ui: "limit" });
}

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const groqMessages = isFinal
      ? [{ role: "user" as const, content: extractTripSummary(messages) }]
      : messages.map((m: any) => ({
          role: m.role === "assistant" ? "assistant" as const : "user" as const,
          content: m.content,
        }));

    const content = await callGroqWithRetry(
      groq,
      isFinal ? FINAL_PROMPT : PROMPT,
      groqMessages,
      isFinal
    );

    if (!content) {
      return NextResponse.json(
        { resp: "AI is busy right now. Please try again in a few seconds.", ui: "text" },
        { status: 500 }
      );
    }

    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
      if (!parsed.resp && !parsed.trip_plan) parsed.resp = "Let's continue planning!";
      if (!parsed.ui) parsed.ui = "text";
    } catch {
      parsed = { resp: content, ui: "text" };
    }

    return NextResponse.json(parsed);

  } catch (e: any) {
    console.error("Groq error:", e?.message ?? e);

    if (e?.status === 429) {
      return NextResponse.json(
        { resp: "⚠️ Too many requests. Please wait a moment and try again.", ui: "text" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { resp: "Something went wrong. Please try again.", ui: "text" },
      { status: 500 }
    );
  }
}