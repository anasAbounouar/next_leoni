/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/theme");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
     "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        leoniPrimary: '#002C77', // Deep blue
        leoniSecondary: '#FFB81C', // Bright yellow
        leoniAccent: '#00A3E0', // Sky blue
        gray: {
          900: '#1A1A1A', // Dark gray
          800: '#2A2A2A', // Slightly lighter gray
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [nextui()],
};
