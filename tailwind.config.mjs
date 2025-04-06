/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        'heavy': '0px 10px 30px rgba(0, 0, 0, 0.5)', // 2x-dən daha ağır shadow
      },
      fontFamily: {
        robotoMono: ['var(--font-roboto-mono)'],
    
      },
    },
  },
  plugins: [],
};
