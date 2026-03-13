module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        surface: "#0f172a",
        primary: {
          500: "#06b6d4",
          600: "#0891b2",
        },
        accent: {
          400: "#a78bfa",
          500: "#8b5cf6",
        },
      },
      boxShadow: {
        glass: "0 20px 48px rgba(2, 6, 23, 0.45)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease",
      },
    },
  },
  plugins: [],
};
