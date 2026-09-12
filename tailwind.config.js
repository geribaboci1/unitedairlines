/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        // United brand tokens — usable as bg-ink, text-platinum, border-ua-glow…
        ink: "#05070B",
        "ink-soft": "#0A0D14",
        platinum: "#94A3B8",
        "ua-blue": "#005DA6",
        "ua-glow": "#00A3E0",
      },
    },
  },
  plugins: [],
};
