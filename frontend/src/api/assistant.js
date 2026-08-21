import { aiApi } from "./client";

// Generative RAG assistant — grounded strictly in the knowledge base.
export const askAssistant = (question) => aiApi.post("/ask", { question }).then((r) => r.data);

// Agentic assistant — reaches for live tools (resource search, categories, classifier).
export const askAgent = (message) => aiApi.post("/agent", { message }).then((r) => r.data);
