/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'brand': '#9a382d',
        'brand-2': '#3d5537',
        'accent': '#e67e22',
        'accent-2': '#f1c40f',
        'wood': '#593d2b',
        'bg': '#f5f0e6',
        'panel': '#fffaf0',
        'panel-2': '#f3e9db',
        'text': '#2a2a2a',
        'muted': '#6b6b6b',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'playfair': ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'spin-wheel': 'spinWheel 4s cubic-bezier(0.17, 0.67, 0.12, 0.99) forwards',
      },
      keyframes: {
        spinWheel: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(1800deg)' },
        },
      },
    },
  },
  plugins: [],
}