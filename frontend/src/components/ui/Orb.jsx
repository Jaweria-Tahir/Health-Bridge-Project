const SIZES = {
  sm: "h-9 w-9",
  md: "h-14 w-14",
  lg: "h-24 w-24",
  xl: "h-44 w-44 sm:h-56 sm:w-56",
};

/**
 * The HealthBridge signature mark: a layered, breathing gradient orb used as the
 * assistant's avatar everywhere from the navbar to the full assistant page.
 * state: "idle" | "listening" | "thinking"
 */
export default function Orb({ size = "md", state = "idle", className = "" }) {
  const isActive = state === "listening" || state === "thinking";

  return (
    <div className={`relative flex items-center justify-center ${SIZES[size]} ${className}`}>
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-500 ${
          isActive ? "opacity-90 animate-pulse-slow" : "opacity-50"
        }`}
        style={{
          background: "radial-gradient(circle, rgba(125,211,255,0.9), rgba(139,92,246,0.5) 60%, transparent 75%)",
        }}
      />
      <div className="absolute inset-0 rounded-full border border-bridge-sky/30 animate-spin-slow" />
      <div className="absolute inset-[10%] rounded-full border border-bridge-violet/30 animate-spin-reverse" />
      <div
        className={`relative h-[62%] w-[62%] rounded-full bg-gradient-to-br from-bridge-sky via-bridge-blue to-bridge-violet shadow-orb ${
          state === "thinking" ? "animate-pulse-slow" : ""
        }`}
      >
        <div className="absolute inset-[18%] rounded-full bg-void/60 backdrop-blur-sm" />
        <div className="absolute inset-[32%] rounded-full bg-gradient-to-tr from-white/70 to-transparent opacity-60" />
      </div>
      {state === "listening" && (
        <span className="absolute -bottom-1 flex gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-0.5 rounded-full bg-bridge-sky animate-pulse-slow"
              style={{ height: `${6 + (i % 2) * 6}px`, animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      )}
    </div>
  );
}
