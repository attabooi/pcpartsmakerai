/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Include pages if you might use it
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Your components folder
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      colors: {
        'brand-bg': '#101010', // Slightly darker than #111216 for more depth
        'content-bg': '#171717', // For main content areas if different from page bg
        'card-bg': '#1D1D1D', // Darker card background
        'card-bg-hover': '#242424',
        'card-border': '#333333', // Subtle border for cards
        'primary-text': '#F0F0F0',
        'secondary-text': '#A0A0A0',
        'accent-blue': '#3B82F6', // Tailwind blue-500
        'accent-purple': '#8B5CF6', // Tailwind violet-500
        'tier-s': '#A855F7', // Purple-500
        'tier-a': '#3B82F6', // Blue-500
        'tier-b': '#22C55E', // Green-500
        'tier-c': '#F97316', // Orange-500
        'danger': '#EF4444', // Red-500 for warnings or errors
      },
      boxShadow: {
        'card-soft': '0 4px 12px rgba(0, 0, 0, 0.15)', // Softer, more diffuse shadow
        'interactive': '0 0 0 2px rgba(59, 130, 246, 0.4)', // Focus ring style
      },
      borderRadius: {
        'card': '0.75rem', // 12px
        'input': '0.5rem', // 8px
      },
      spacing: {
        '4.5': '1.125rem', // 18px
        '5.5': '1.375rem', // 22px
      }
    },
  },
  plugins: [],
}

