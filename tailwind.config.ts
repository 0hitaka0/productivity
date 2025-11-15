import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // INFJ-friendly color palette - soft, calming, intentional
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7cfc7',
          300: '#a3afa3',
          400: '#7d8c7d',
          500: '#627162',
          600: '#4d5a4d',
          700: '#3f493f',
          800: '#353c35',
          900: '#2d322d',
        },
        lavender: {
          50: '#f7f5f9',
          100: '#f0ebf4',
          200: '#e3daea',
          300: '#cebfdb',
          400: '#b49dc7',
          500: '#9a7db0',
          600: '#836599',
          700: '#6f5382',
          800: '#5d466b',
          900: '#4e3c59',
        },
        cream: {
          50: '#fdfcfb',
          100: '#faf7f4',
          200: '#f5ede4',
          300: '#ebe0d2',
          400: '#ddc9b4',
          500: '#c9ab8d',
          600: '#b38d6d',
          700: '#967256',
          800: '#7b5d49',
          900: '#664e3e',
        },
        midnight: {
          50: '#f4f5f7',
          100: '#e3e5ea',
          200: '#c9ced8',
          300: '#a4adbf',
          400: '#7a87a0',
          500: '#5f6b85',
          600: '#4d566d',
          700: '#3f4659',
          800: '#373d4c',
          900: '#2a2f3a',
          950: '#1a1d25',
        },
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
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "gentle-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "gentle-bounce": "gentle-bounce 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
