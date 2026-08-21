import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send, Sparkles, Bot, ShieldAlert } from "lucide-react";
import Orb from "../components/ui/Orb.jsx";
import ChatBubble from "../components/chat/ChatBubble.jsx";
import TypingIndicator from "../components/chat/TypingIndicator.jsx";
import { askAssistant, askAgent } from "../api/assistant.js";
import { getErrorMessage } from "../api/client.js";

const MODES = [
  {
    id: "ask",
    label: "Ask",
    icon: Sparkles,
    hint: "Grounded answers from the health knowledge base (RAG).",
  },
  {
    id: "agent",
    label: "Agent",
    icon: Bot,
    hint: "Reaches for live tools to find resources and categorize your topic.",
  },
];

const SUGGESTIONS = [
  "Explain hypertension prevention in simple language",
  "I need information about vaccination resources",
  "What's a healthy daily meal plan look like?",
  "How do I recognize signs of stress or burnout?",
];

function useSpeechRecognition(onResult) {
  const recognitionRef = useRef(null);
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    setSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return { supported, listening, toggle };
}

export default function Assistant() {
  const location = useLocation();
  const [mode, setMode] = useState("ask");
  const [input, setInput] = useState(location.state?.prefill || "");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, I'm the HealthBridge assistant. Ask me a health question, or switch to Agent mode to find real community resources.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);


  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const data = mode === "ask" ? await askAssistant(question) : await askAgent(question);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.answer,
          disclaimer: data.disclaimer,
          sources: data.sources,
        },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          isError: true,
          content: getErrorMessage(
            err,
            "The assistant service isn't reachable right now. Make sure the AI service is running."
          ),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send();
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-5.5rem)] max-w-4xl flex-col lg:h-[calc(100vh-4.75rem)]">
      <div className="mb-4 flex flex-col items-center gap-3 pt-2 text-center">
        <Orb size="lg" state={loading ? "thinking" : "idle"} />
        <div>
          <h1 className="font-display text-xl text-ink">HealthBridge Assistant</h1>
          <p className="text-sm text-ink-muted">{MODES.find((m) => m.id === mode)?.hint}</p>
        </div>

        <div className="glass inline-flex rounded-full p-1">
          {MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                mode === id ? "bg-gradient-to-r from-bridge-sky to-bridge-violet text-void" : "text-ink-muted hover:text-ink"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto rounded-xl2 px-1 py-4 sm:px-2">
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} {...m} />
        ))}
        {loading && <TypingIndicator />}

        {messages.length === 1 && (
          <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="glass rounded-xl px-4 py-3 text-left text-sm text-ink-muted transition-colors hover:text-ink hover:bg-white/[0.06]"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="sticky bottom-0 pb-2 pt-3">
        <div className="glass-panel flex items-center gap-2 !rounded-full p-2 pl-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "ask" ? "Ask a health question…" : "Describe what you need help finding…"}
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
            aria-label="Message"
          />
          
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-bridge-sky to-bridge-violet text-void transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            aria-label="Send message"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-faint">
          <ShieldAlert size={11} />
          Educational information only — not a diagnosis. For emergencies, contact local emergency services.
        </p>
      </form>
    </div>
  );
}
