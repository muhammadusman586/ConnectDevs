/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "system-ui", "sans-serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["Fira Code", "ui-monospace", "monospace"],
      },
      colors: {
        accent: {
          DEFAULT: "#FF8A00",
          bright: "#FFA033",
          dim: "#CC6E00",
        },
        bg: "#0a0a0a",
        surface: "#111111",
        elevated: "#161616",
        border: "#1e1e1e",
        muted: "#999999",
        body: "#ffffff",
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 138, 0, 0.15)",
        "glow-sm": "0 0 12px rgba(255, 138, 0, 0.18)",
        "glow-lg": "0 0 40px rgba(255, 138, 0, 0.2)",
        term: "0 20px 60px -20px rgba(0,0,0,.8), 0 0 0 1px #1e1e1e",
      },
      animation: {
        blink: "blink 1s steps(2) infinite",
        "fade-in": "fadeIn 0.5s ease-out both",
        "slide-up": "slideUp 0.5s ease-out both",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        terminal: {
          primary: "#FF8A00",
          "primary-content": "#0a0a0a",
          secondary: "#1e1e1e",
          "secondary-content": "#FF8A00",
          accent: "#FF8A00",
          "accent-content": "#0a0a0a",
          neutral: "#161616",
          "neutral-content": "#999999",
          "base-100": "#0a0a0a",
          "base-200": "#111111",
          "base-300": "#161616",
          "base-content": "#ffffff",
          info: "#67e8f9",
          success: "#22c55e",
          warning: "#eab308",
          error: "#ef4444",
          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "0.375rem",
          "--animation-btn": "0.2s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
      },
    ],
  },
};
