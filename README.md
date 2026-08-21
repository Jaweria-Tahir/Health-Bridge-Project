# HealthBridge

https://health-bridge-project.vercel.app/

HealthBridge is a platform that helps people find reliable, understandable health
information and verified community resources — clinics, vaccination centers, and
support helplines — without ever attempting to diagnose a medical condition. Every
answer is grounded in a curated knowledge base and includes a clear educational
disclaimer, with a human-in-the-loop escalation path (the Questions module) for
anything that needs a real healthcare provider or organization.

## Problem

People often struggle to find reliable, understandable information about basic
health services, preventive care, and available community resources. HealthBridge
addresses this by combining a grounded AI assistant, a searchable resource
directory, and a curated education library — while staying strictly informational
rather than diagnostic.

## Relevant SDGs

- **SDG 3 — Good Health and Well-being**: connects people to real preventive-care
  resources (clinics, vaccination centers, mental wellness helplines) and plain-
  language health education.
- **SDG 4 — Quality Education**: the Education module delivers curated, categorized
  health literacy content (nutrition, hygiene, vaccination, first aid) in accessible
  language.
- **SDG 10 — Reduced Inequalities**: lowers the barrier to understanding and finding
  health services for people without easy access to formal healthcare navigation.
- **SDG 16 — Peace, Justice and Strong Institutions**: keeps information sourced and
  verifiable, routes citizen questions to accountable organizations/admins, and
  never substitutes for licensed medical judgment.

## Architecture

HealthBridge is split into four independently deployable services:

```
frontend (React + Vite)
   │
   ├──► backend (Node/Express + MongoDB)      — auth, resources, education, questions
   │
   └──► ai-service (FastAPI + Groq)            — /ask (RAG) and /agent (tool-calling)
              │
              └──► python-service (FastAPI)    — content classification & resource search
```

- **frontend** — React 18 + Vite + Tailwind CSS. Talks to `backend` for app data/auth
  and directly to `ai-service` for the AI assistant.
- **backend** — Express API backed by MongoDB (Atlas). Handles auth (JWT), resources,
  education content, and citizen questions. Also proxies resource "analysis" requests
  to `python-service`.
- **ai-service** — FastAPI service using the Groq API. Exposes:
  - `POST /ask` — Retrieval-Augmented Generation over a local health knowledge base;
    answers are grounded only in retrieved context and always carry a disclaimer.
  - `POST /agent` — tool-calling agent that can search resources/articles, classify
    topics, and list categories via `python-service`.
- **python-service** — lightweight FastAPI service with a keyword-based content
  classifier and a resource search/ranking engine, consumed by both `ai-service` and
  `backend`.

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios, Framer Motion, react-markdown |
| Backend | Node.js, Express 5, Mongoose, JWT auth (jsonwebtoken), bcryptjs |
| Database | MongoDB Atlas |
| AI service | FastAPI, Groq API (OpenAI-compatible chat completions + tool calling) |
| Python service | FastAPI, scikit-learn-adjacent keyword classification |
| Infra (optional) | Docker, Kubernetes manifests (`k8s/`), Terraform (`terraform/`) |

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+ and pip
- A MongoDB Atlas cluster (connection string) with Network Access allowing your IP
  (or `0.0.0.0/0` for development)
- A Groq API key from [console.groq.com/keys](https://console.groq.com/keys)

## Project structure

```
healthbridge-ai/
├── backend/          # Express API + MongoDB models
├── frontend/          # React + Vite app
├── ai-service/         # FastAPI: Groq-backed RAG + agent
├── python-service/     # FastAPI: classification + resource search
├── k8s/                # Kubernetes manifests (optional)
├── terraform/          # Infra-as-code (optional)
└── setup.sh
```

## Environment variables

Each service reads its own `.env` file (copy from the matching `.env.example`).

**`backend/.env`**
```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/healthbridge?retryWrites=true&w=majority
JWT_SECRET=<a long random string>
PORT=5000
CLIENT_URL=http://localhost:3000
PYTHON_SERVICE_URL=http://localhost:8002
```

**`ai-service/.env`**
```
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL=openai/gpt-oss-20b
PYTHON_SERVICE_URL=http://localhost:8002
```

**`python-service/.env`**
```
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL=openai/gpt-oss-20b
```

**`frontend/.env`**
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_AI_API_BASE_URL=http://localhost:8010
```

> Note: Groq periodically deprecates older model IDs (e.g. `llama-3.1-8b-instant`).
> Check [console.groq.com/docs/deprecations](https://console.groq.com/docs/deprecations)
> if you get a `model_not_found` error, and update `GROQ_MODEL` accordingly.

## Running locally

Open four terminals, one per service:

```bash
# 1. Backend (Express + MongoDB)
cd backend
npm install
npm run dev              # http://localhost:5000

# 2. Python service (classification + search)
cd python-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8002

# 3. AI service (Groq RAG + agent)
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8010

# 4. Frontend (React + Vite)
cd frontend
npm install
npm run dev               # http://localhost:3000 (or 5173, depending on config)
```

Health checks:
- Backend: `GET http://localhost:5000/health`
- AI service: `GET http://localhost:8010/health`
- Python service: `GET http://localhost:8002/health`

## Seeding sample data

Resources and education content are empty until seeded (nothing populates them
automatically). From `backend/src`:

```bash
node seed.js
```

This creates a sample organization user and inserts a handful of sample resources
and education articles. It's safe to re-run — it skips seeding if data already exists.

## Key API endpoints

**Backend (`/api`)**
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/resources`, `GET /api/resources/search`, `POST/PUT/DELETE /api/resources/:id`
- `GET /api/education`, `GET /api/education/search`, `POST/PUT/DELETE /api/education/:id`
- `GET/POST /api/questions`

**AI service**
- `POST /ask` — `{ "question": "..." }` → grounded answer + sources + disclaimer
- `POST /agent` — `{ "message": "..." }` → tool-using agent response

**Python service**
- `POST /classify`, `POST /search`, `POST /analyze`, `GET /categories`

## Deployment notes

Deploy the four services independently (they have different runtimes):
- **Backend / ai-service / python-service**: Render, Railway, or Fly.io, using each
  service's `Dockerfile` where available. Set each service's environment variables
  in the platform's dashboard.
- **Frontend**: a static/SPA host such as Vercel or Netlify works well; point its
  build env vars at the deployed backend/ai-service URLs.
- **MongoDB Atlas**: already cloud-hosted — no separate deployment needed. Confirm
  Network Access allows the deployed services' IPs (or `0.0.0.0/0`).
- `k8s/` and `terraform/` are provided for teams that want to self-host on
  Kubernetes or provision cloud infrastructure directly; they're optional for a
  standard PaaS deployment.

## Safety & scope

HealthBridge is strictly informational. The AI assistant is instructed to never
diagnose conditions or recommend specific treatments/medications, answers only from
retrieved/grounded context, and every response carries an educational disclaimer
directing users to licensed healthcare providers or emergency services when needed.
