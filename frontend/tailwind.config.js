/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#05070f",
          900: "#03040a",
          800: "#070a16",
          700: "#0b1020",
          600: "#0f1530",
          500: "#141b3d",
        },
        glass: {
          border: "rgba(148, 163, 255, 0.14)",
          hair: "rgba(148, 163, 255, 0.08)",
        },
        ink: {
          DEFAULT: "#e7ecfb",
          muted: "#96a0c3",
          faint: "#616b8f",
        },
        bridge: {
          cyan: "#5eead4",
          sky: "#7dd3ff",
          blue: "#5b8cff",
          violet: "#8b5cf6",
          magenta: "#c084fc",
        },
        signal: {
          good: "#34d399",
          warn: "#fbbf24",
          bad: "#fb7185",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(148,163,255,0.12), 0 20px 60px -20px rgba(91,140,255,0.35)",
        "glow-lg": "0 0 0 1px rgba(148,163,255,0.14), 0 30px 90px -25px rgba(139,92,246,0.45)",
        orb: "0 0 60px 10px rgba(91,140,255,0.35), 0 0 120px 40px rgba(139,92,246,0.18)",
      },
      backgroundImage: {
        "radial-fade": "radial-gradient(circle at 50% 0%, rgba(91,140,255,0.16), transparent 60%)",
        "grid-lines":
          "linear-gradient(rgba(148,163,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,255,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "42px 42px",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: 0.55, transform: "scale(1)" },
          "50%": { opacity: 0.9, transform: "scale(1.06)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "spin-reverse": {
          to: { transform: "rotate(-360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 4s ease-in-out infinite",
        "spin-slow": "spin-slow 14s linear infinite",
        "spin-reverse": "spin-reverse 18s linear infinite",
        float: "float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease both",
        shimmer: "shimmer 2.5s linear infinite",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
