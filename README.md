<h1 align="center">
  <img src="public/logo.png" alt="RoamifyAI Logo" width="48" height="48" />
</h1>

# RoamifyAI : AI-Powered Trip Planning Platform
RoamifyAI is a **full-stack AI travel planning platform** that generates personalized travel itineraries through a conversational chat interface.
The project combines **AI-powered itinerary generation, real-time backend infrastructure, interactive mapping, and a modern frontend**, while being deployed using a **production-style DevOps pipeline with Docker, Terraform, Ansible, GitHub Actions, and AWS.**

# Live Demo
https://roamifyai.tech 

# Core Features
* Conversational AI chatbot for trip planning
* Multi-day itinerary generation with activities
* AI powered travel planning using LLMs
* Minimum 3 recommended hotels per trip
* Interactive global map with activity markers
* User authentication and saved trips
* Real-time serverless backend
* Fully automated CI/CD deployment pipeline


# System Architecture
### Application Architecture

```High level flow:
User
↓
Domain (roamifyai.tech)
↓
Nginx Reverse Proxy
↓
Docker Container
↓
Next.js Full Stack App
```
### External services:

```Next.js App → Clerk (Authentication)  
Next.js App → Arcjet (Rate Limiting)  
Next.js App → Convex (Database + Backend)  
Next.js App → OpenRouter (AI Generation)  
Next.js App → Mapbox / Google Maps (Location Data)
```
# Tech Stack

| Layer | Technologies |
|------|-------------|
| Frontend | Next.js, React, TypeScript, TailwindCSS, ShadCN UI |
| Backend | Convex (Serverless Database + Backend Functions) |
| AI | OpenRouter (LLM Integration) |
| Maps | Mapbox GL |
| Authentication | Clerk |
| Rate Limiting | Arcjet |
| Infrastructure | AWS EC2 |
| Containerization | Docker |
| Reverse Proxy | Nginx |
| Infrastructure as Code | Terraform |
| Server Configuration | Ansible |
| CI/CD | GitHub Actions |
| Container Registry | Docker Hub |
# DevOps Architecture
RoamifyAI is deployed using a **modern DevOps workflow**.

Tools used:
* Docker – containerization
* Docker Hub – image registry
* GitHub Actions – CI/CD automation
* Terraform – infrastructure provisioning
* Ansible – server configuration
* AWS EC2 – hosting
* Nginx – reverse proxy
* Let's Encrypt – SSL certificates
# CI/CD Pipeline
The deployment pipeline is fully automated using **GitHub Actions**.

### Pipeline workflow:
1. Developer pushes code to GitHub
2. GitHub Actions pipeline starts
3. Docker image is built
4. Image is pushed to Docker Hub
5. GitHub Actions connects to EC2 via SSH
6. Server pulls latest Docker image
7. Running container is restarted automatically
# Infrastructure Automation
Infrastructure is automated using **Infrastructure as Code**.
### Terraform
Terraform provisions:
* AWS EC2 instance
* Security groups
* Networking configuration
### Ansible
Ansible configures the server:
* installs Docker
* configures environment variables
* deploys Docker containers
* manages application runtime


# Environment Variables


Create `.env.local`
```
CONVEX_DEPLOYMENT=<convex_deployment_key>  
NEXT_PUBLIC_CONVEX_URL=<convex_deployment_url>  
GROQ_API_KEY=<groq_api_key>
```
Create `.env`

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<clerk_publishable_key>  
CLERK_SECRET_KEY=<clerk_secret_key>  
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in  
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up  
ARCJET_KEY=<arcjet_api_key>  
GOOGLE_PLACE_API_KEY=<google_places_api_key>  
NEXT_PUBLIC_MAPBOX_API_KEY=<mapbox_api_key>
```
# Running Locally
1. `npm install`

2. `npx convex dev`

3. `npm run dev`

Application runs at:
http://localhost:3000
# What This Project Demonstrates
* Full stack application development
* AI integration into web apps
* Serverless backend architecture
* Containerization with Docker
* Infrastructure as Code
* Automated CI/CD deployment
* Cloud hosting on AWS
* Reverse proxy configuration
# 
 Author
Saksham  
Computer Science Student  
DevOps & Cloud Engineer
