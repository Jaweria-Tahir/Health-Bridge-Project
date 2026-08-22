import os
import json
from pathlib import Path

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq, APIError

from rag import knowledge_base

# Changed: .env now expected inside ai-service/ (same folder as this file)
ROOT_DIR = Path(__file__).resolve().parent

def load_env():
    load_dotenv(ROOT_DIR / ".env", override=True)

load_env()

app = FastAPI(title="HealthBridge AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_groq_client():
    load_env()
    api_key = (os.environ.get("GROQ_API_KEY") or "").strip().strip('"').strip("'")
    if not api_key or api_key in {"your_groq_api_key_here", "your_key_here"}:
        raise HTTPException(
            status_code=503,
            detail="GROQ_API_KEY is missing. Put a real key from https://console.groq.com/keys in the ai-service/.env file.",
        )
    if not api_key.startswith("gsk_"):
        raise HTTPException(
            status_code=503,
            detail="GROQ_API_KEY does not look like a Groq key (it should start with gsk_). Create a new key at https://console.groq.com/keys",
        )
    return Groq(api_key=api_key)


def groq_chat(**kwargs):
    try:
        return get_groq_client().chat.completions.create(model=MODEL, **kwargs)
    except APIError as exc:
        message = str(exc)
        if "401" in message or "invalid_api_key" in message.lower():
            raise HTTPException(
                status_code=401,
                detail=(
                    "Groq rejected GROQ_API_KEY (invalid or revoked). "
                    "Create a new secret key at https://console.groq.com/keys, "
                    "paste only the key into ai-service/.env on one line as GROQ_API_KEY=gsk_..., "
                    "with no quotes or spaces."
                ),
            ) from exc
        raise HTTPException(status_code=502, detail=f"Groq API error: {exc}") from exc

MODEL = os.environ.get("GROQ_MODEL", "llama-3.1-8b-instant")
PYTHON_SERVICE_URL = os.environ.get("PYTHON_SERVICE_URL", "https://health-bridge-project.onrender.com/")
BACKEND_URL = os.environ.get("BACKEND_URL", "https://health-bridge-project-2.onrender.com/")

DISCLAIMER = (
    "This information is general health education only. It is not a medical diagnosis "
    "or emergency treatment. For symptoms, emergencies, or personal medical decisions, "
    "please consult a licensed healthcare provider or emergency services."
)

# ---------- Generative AI Health Education Assistant (RAG)
class AskRequest(BaseModel):
    question: str

@app.post("/ask")
def ask(req: AskRequest):
    retrieved = knowledge_base.retrieve(req.question, top_k=3)
    context_text = "\n\n".join(f"[{r['source']}] {r['text']}" for r in retrieved)

    system_prompt = (
        "You are a community health education assistant. Answer ONLY using the "
        "provided context below. Explain things in simple, plain language a non-expert "
        "can understand. You must NEVER diagnose a condition or recommend a specific "
        "treatment/medication. If the context doesn't contain the answer, say you don't "
        "have verified information on that topic and suggest consulting a healthcare "
        f"provider.\n\nCONTEXT:\n{context_text}"
    )

    response = groq_chat(
        max_tokens=500,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": req.question},
        ],
    )

    answer_text = response.choices[0].message.content or ""

    return {
        "answer": answer_text,
        "disclaimer": DISCLAIMER,
        "sources": [r["source"] for r in retrieved],
    }


# ---------- Agentic Health Resource Agent (tool use)
FALLBACK_CATEGORIES = [
    "Nutrition", "Hygiene", "Vaccination", "First Aid", "Preventive Care", "Healthy Lifestyle"
]


def _call_python_service(method: str, path: str, **kwargs):
    url = f"{PYTHON_SERVICE_URL.rstrip('/')}{path}"
    try:
        response = requests.request(method, url, timeout=10, **kwargs)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=503,
            detail=f"python-service unavailable at {PYTHON_SERVICE_URL}: {exc}",
        ) from exc


def search_resources(query: str, authorization: str):
    classified = _call_python_service("POST", "/classify", json={"text": query})
    category_map = {
        "Nutrition": "public_health",
        "Hygiene": "public_health",
        "Vaccination": "vaccination",
        "First Aid": "emergency",
        "Preventive Care": "preventive_care",
        "Healthy Lifestyle": "mental_wellness",
    }
    category = category_map.get(classified.get("category"))
    try:
        response = requests.get(
            f"{BACKEND_URL.rstrip('/')}/api/resources/search",
            params={"q": query, "category": category} if category else {"q": query},
            headers={"Authorization": authorization},
            timeout=10,
        )
        response.raise_for_status()
        return response.json().get("resources", [])
    except requests.HTTPError as exc:
        status_code = exc.response.status_code if exc.response is not None else 503
        if status_code in {401, 403}:
            raise HTTPException(status_code=status_code, detail="Resource search authentication failed") from exc
        raise HTTPException(
            status_code=502,
            detail=f"backend resource search failed with status {status_code}",
        ) from exc
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=503,
            detail=f"backend unavailable at {BACKEND_URL}: {exc}",
        ) from exc


def search_health_articles(query: str):
    return knowledge_base.retrieve(query, top_k=2)


def retrieve_categories():
    try:
        data = _call_python_service("GET", "/categories")
        return data["categories"]
    except HTTPException:
        return FALLBACK_CATEGORIES


def classify_health_topic(text: str):
    return _call_python_service("POST", "/classify", json={"text": text})


TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "search_resources",
            "description": "Search the community resource directory (clinics, vaccination centers, helplines) by keyword.",
            "parameters": {
                "type": "object",
                "properties": {"query": {"type": "string"}},
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "search_health_articles",
            "description": "Search the health education knowledge base for relevant articles.",
            "parameters": {
                "type": "object",
                "properties": {"query": {"type": "string"}},
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "retrieve_categories",
            "description": "List all available health education categories.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "classify_health_topic",
            "description": "Classify free-text health content into a category (Nutrition, Hygiene, Vaccination, etc.).",
            "parameters": {
                "type": "object",
                "properties": {"text": {"type": "string"}},
                "required": ["text"],
            },
        },
    },
]

TOOL_FUNCTIONS = {
    "search_resources": lambda inp: search_resources(inp["query"]),
    "search_health_articles": lambda inp: search_health_articles(inp["query"]),
    "retrieve_categories": lambda inp: retrieve_categories(),
    "classify_health_topic": lambda inp: classify_health_topic(inp["text"]),
}


class AgentRequest(BaseModel):
    message: str


@app.post("/agent")
def agent(req: AgentRequest, authorization: str | None = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")

    messages = [
        {
            "role": "system",
            "content": (
                "You are a health resource agent. Use the available tools to find real "
                "resources or articles before answering. Always ground your answer in "
                "what the tools return."
            ),
        },
        {"role": "user", "content": req.message},
    ]

    for _ in range(3):
        response = groq_chat(
            max_tokens=500,
            tools=TOOLS,
            tool_choice="auto",
            messages=messages,
        )

        message = response.choices[0].message

        if not message.tool_calls:
            return {"answer": message.content or "", "disclaimer": DISCLAIMER}

        messages.append(message.model_dump(exclude_none=True))
        for tool_call in message.tool_calls:
            function_args = json.loads(tool_call.function.arguments)
            if tool_call.function.name == "search_resources":
                result = search_resources(function_args["query"], authorization)
            else:
                result = TOOL_FUNCTIONS[tool_call.function.name](function_args)
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result),
            })

    return {"answer": "Could not complete the request.", "disclaimer": DISCLAIMER}


@app.get("/health")
def health():
    load_env()
    api_key = (os.environ.get("GROQ_API_KEY") or "").strip().strip('"').strip("'")
    return {
        "status": "ok",
        "groq_key_loaded": bool(api_key),
        "groq_key_starts_with_gsk": api_key.startswith("gsk_"),
        "groq_key_length": len(api_key),
    }