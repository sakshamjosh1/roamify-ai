# ---------- Stage 1: Build ----------
FROM node:18-slim AS builder

WORKDIR /app

# Accept build arguments
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CONVEX_URL
ARG NEXT_PUBLIC_MAPBOX_API_KEY

# Set environment variables
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CONVEX_URL=$NEXT_PUBLIC_CONVEX_URL
ENV NEXT_PUBLIC_MAPBOX_API_KEY=$NEXT_PUBLIC_MAPBOX_API_KEY

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build


# ---------- Stage 2: Production ----------
FROM node:18-slim

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "start","--", "-H", "0.0.0.0"]