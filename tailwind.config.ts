import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'checkerboard': 'conic-gradient(#e5e7eb 90deg, #f3f4f6 90deg 180deg, #e5e7eb 180deg 270deg, #f3f4f6 270deg)',
        'checkerboard-dark': 'conic-gradient(#374151 90deg, #1f2937 90deg 180deg, #374151 180deg 270deg, #1f2937 270deg)',
      },
    },
  },
  plugins: [],
};
export default config;
