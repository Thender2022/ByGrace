/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          gold: {
            50: '#fdf8e6',
            100: '#fae8b3',
            200: '#f7d880',
            300: '#f4c84d',
            400: '#f1b81a',
            500: '#d4af37',
            600: '#b8962e',
            700: '#9c7d25',
            800: '#80641c',
            900: '#644b13',
          },
        },
      },
    },
    plugins: [],
  }