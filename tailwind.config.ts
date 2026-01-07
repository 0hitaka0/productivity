import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // or 'media' or 'class' - we probably want to force dark or stick to class
  theme: {
    extend: {
      colors: {
        // High contrast, premium cosmic palette
        background: "#000000",
        foreground: "#ffffff",
        card: "#0a0a0a",
        "card-foreground": "#ffffff",

        // Renaming Sage/Lavender to something more "Cosmic Tech"
        // But keeping the keys compatible where possible or doing a hard replace?
        // Let's do a hard replace of the palette to be cleaner.

        // Neutral greys (Stardust)
        slate: {
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },

        // Accents (Nebula)
        primary: {
          DEFAULT: "#ffffff",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#27272a",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#a855f7", // Purple
          foreground: "#ffffff",
        },

        // Legacy support mappings to prevent immediate breakage (will refactor components after)
        sage: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a', // Much darker
        },
        midnight: {
          700: '#1e293b',
          800: '#0f172a',
          900: '#020617', // Very dark blue/black
          950: '#000000', // True black
        },
        cream: {
          50: '#ffffff', // Stark white
          100: '#f8fafc',
        },
        lavender: {
          400: '#c084fc', // Bright purple
          500: '#a855f7',
          600: '#9333ea',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "twinkle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        }
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "twinkle": "twinkle 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
