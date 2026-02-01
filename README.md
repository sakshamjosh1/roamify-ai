<h1 align="center">
  <img src="public/logo.png" alt="RoamifyAI Logo" width="48" height="48" />
</h1>

# AI-Powered Trip Planning Platform

RoamifyAI is a full-stack AI travel planning application that helps users create personalized travel itineraries through a conversational chat interface.
It combines AI, real-time backend, maps, and modern frontend architecture, while being designed to scale with DevOps and cloud deployments in mind.

## Core Features
* Conversational AI chatbot for trip planning
* Multi-day itinerary generation with activities
* At least 3 recommended hotels per trip
* Interactive global map with activity markers
* User authentication and saved trips
* Real-time serverless backend

## Tech Stack

| Layer              | Technologies                                                  | 
|--------------------|---------------------------------------------------------------|
| Frontend           | Next.js, React.js, TypeScript, TailwindCSS, ShadCN UI         | 
| Backend            | Convex (Serverless Database & API)                            | 
| AI                 | OpenRouter (for LLMs)                                         |
| Maps               | Mapbox GL                                                     |
| Auth               | Clerk Authentication                                          |
| DevOps (in future) | CI/CD, Docker, AWS                                            |



## Project Architecture

### User Flow

```bash
User → Next.js Frontend → AI API (OpenRouter)
     → Convex Backend (DB + APIs)
     → Mapbox (Visualization)
```

### Frontend Structure

```
app/
├── _components/
├── (auth)/
├── api/ 
|    └──aimodel/       # AI chat route
|    └──arcjet/        # For Rate Limiting
|    └──google-places/ # Location on Google Maps
├── create-new-trip/   # Chatbox, itinerary UI
├── my-trips/          # Saved Trips
├── pricing/           # Pricing Model
```

### Backend Structure
```
convex/
 ├── user.ts            # User queries
 ├── tripDetail.ts      # Trip create / fetch logic
 └── schema.ts          # Database schema
```

## Environment Variables
Create a .env.local file for Convex Deployment:
```
CONVEX_DEPLOYMENT=<convex_deployment_key>
NEXT_PUBLIC_CONVEX_URL=<convex_deployment_url>
OPENROUTER_API_KEY=<openrouter_api_key>
```
Create a .env file
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<clerk_publishable_key>
CLERK_SECRET_KEY=<clerk_secret_key>

Clerk's Default SignIn/SignUp: 
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/

ARCJET_KEY=<arcjet_api_key>
GOOGLE_PLACE_API_KEY=<google_places_api_key>
EXT_PUBLIC_MAPBOX_API_KEY=<mapbox_api_key>
```

## ▶️ Running Locally
### 1. Install dependencies
```
npm install
```
### 2. Start Convex
```
npx convex dev
```
### 3. Run Next.js
```
npm run dev
```
## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## 👨‍💻 Author

Saksham
Computer Science Student
