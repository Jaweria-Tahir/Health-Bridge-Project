# HealthBridge API documentation

HealthBridge is made up of three services that talk to each other over HTTP: a Node/Express **backend** backed by MongoDB, a FastAPI **ai-service** that wraps Groq, and a small FastAPI **python-service** that does keyword classification and search. The React frontend talks to the backend for everything app-related, and goes straight to the ai-service for the chat assistant.

Local ports, if you're running everything with `npm run dev` / `uvicorn --reload`:

- Backend: `http://localhost:5000`
- AI service: `http://localhost:8010` (mapped to `8001` in docker-compose)
- Python service: `http://localhost:8002`

Each one exposes a `GET /health` you can hit to check it's alive.

## 1. Backend (`/api`)

Everything here needs a JWT except registering and logging in. Once you've got a token, send it as `Authorization: Bearer <token>` on every request. Tokens carry `{ userId, role }` and expire after 24 hours. A handful of routes are also gated by role — `citizen`, `organization`, or `admin`.

### Auth

**`POST /api/auth/register`** — takes `{ name, email, password }` and creates a user. Worth knowing: everyone who registers this way comes in as `citizen`. There's no self-serve path to `organization` or `admin` — those would need to be set directly in the database or through some admin tooling that isn't in this repo. Returns `201` with the new user (no password), `400` if a field's missing or the email's taken.

**`POST /api/auth/login`** — `{ email, password }` → `200` with a token and the user object, or `401` if the credentials don't match.

**`GET /api/auth/me`** — returns whoever the token belongs to. `404` if that user's been deleted since the token was issued.

### Resources

These are the clinics, vaccination centers, and helplines in the directory. Category has to be one of: `clinic`, `vaccination`, `emergency`, `mental_wellness`, `preventive_care`, `public_health`.

- **`GET /api/resources`** — everything, `createdBy` populated. Any logged-in user.
- **`GET /api/resources/search?q=&category=`** — `q` does a loose (case-insensitive) match across name, description, and location; `category` is an exact filter.
- **`GET /api/resources/:id`** — one resource, or `404`.
- **`POST /api/resources`** — org/admin only. Needs `name`, `category`, `description`, `location`, `contactInformation`, and `availability` — all required, no partial creates.
- **`PUT /api/resources/:id`** — org/admin only, partial updates are fine here.
- **`DELETE /api/resources/:id`** — admin only.
- **`POST /api/resources/:id/analyze`** — org/admin only. Hands the resource's name/description/location off to the python-service and returns its category guess. If python-service is down this comes back as a `500`.

### Education

Health-literacy articles. Category is one of `nutrition`, `hygiene`, `vaccination`, `first_aid`, `preventive_care`, `healthy_lifestyle`; status is `published` or `draft`.

- **`GET /api/education`** and **`GET /api/education/search?q=&category=`** — both only ever return `published` items, newest first. Drafts are invisible through these routes.
- **`GET /api/education/:id`** — same story, `404` if the item isn't published (even if it exists).
- **`POST /api/education`** — org/admin only. `title`, `category`, `summary`, `content`, `source` are required; `status` defaults to `published` if you leave it out.
- **`PUT /api/education/:id`** — org/admin.
- **`DELETE /api/education/:id`** — admin only.

### Questions

This is the escalation path — a citizen asks something the AI assistant can't safely answer, and it lands in front of a human.

- **`POST /api/questions`** — citizens only. `{ question, category }`, category defaults to `general_health` if omitted.
- **`GET /api/questions/my`** — citizens only, their own questions.
- **`GET /api/questions`** — org/admin only, everyone's questions.
- **`PUT /api/questions/:id`** — org/admin. Set `answer` and/or `status` (`pending` / `reviewed` / `answered`); the responder gets stamped in as `reviewedBy` automatically.

## 2. AI service

Two endpoints, no auth of its own (CORS is wide open — it trusts whatever's calling it, which in practice is just the frontend).

**`POST /ask`** — the grounded Q&A endpoint. It pulls the 3 most relevant chunks out of a local TF-IDF index built from the `.txt` files in `ai-service/knowledge/` (nutrition, hygiene, vaccination, first aid, hypertension, mental wellness), then asks Groq to answer using *only* that context — explicitly told never to diagnose or recommend treatment. Send `{ question }`, get back:

```json
{
  "answer": "...",
  "disclaimer": "This information is general health education only...",
  "sources": ["nutrition.txt"]
}
```

If `GROQ_API_KEY` is missing or wrong you'll get a `503` or `401` with a message telling you where to fix it.

**`POST /agent`** — the tool-using version. Send `{ message }` and it loops with Groq (up to 3 rounds) letting the model call out to four tools before answering — see the workflow diagram for the full picture:

| Tool | What it does |
|---|---|
| `search_resources` | classifies the query, then searches a resource list |
| `search_health_articles` | top-2 knowledge-base matches |
| `retrieve_categories` | lists categories |
| `classify_health_topic` | classifies arbitrary text |

One thing to flag: `search_resources` currently searches a hardcoded list of 3 sample resources baked into `main.py`, not the live MongoDB directory the backend manages. If the intent is for the agent to recommend real, up-to-date resources, that's the piece that still needs wiring up.

## 3. Python service

No auth, just plain classification/search logic — nothing calls out to Groq here despite the `.env.example` listing a Groq key.

- **`POST /classify`** — `{ text }` → best-guess category from 6 options, based on keyword matching.
- **`POST /search`** — takes a query plus a list of resources, auto-fills any missing categories, and returns them ranked by how many query terms show up in the name/description/category.
- **`POST /analyze`** — what the backend's `/resources/:id/analyze` calls under the hood. Classifies into the Mongo `Resource` taxonomy (`clinic`, `vaccination`, `emergency`, `mental_wellness`, `preventive_care`, `public_health`) with a full score breakdown.
- **`GET /categories`** — the fixed list of 6 categories used by `/classify`.

## How it all connects

| From | To | For |
|---|---|---|
| frontend | backend | everything under `/api` |
| frontend | ai-service | `/ask`, `/agent` |
| backend | python-service | `/analyze` |
| ai-service | python-service | `/classify`, `/search`, `/categories` |
| ai-service | Groq | the actual chat completions |

## Environment variables, by service

**backend** — `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL`, `PYTHON_SERVICE_URL`

**ai-service** — `GROQ_API_KEY`, `GROQ_MODEL` (defaults to `llama-3.1-8b-instant`), `PYTHON_SERVICE_URL`

**python-service** — `GROQ_API_KEY`, `GROQ_MODEL` are in the example file but the service doesn't actually use them right now

**frontend** — `VITE_API_BASE_URL`, `VITE_AI_API_BASE_URL`
