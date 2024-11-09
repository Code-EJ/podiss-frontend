module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-red': '#FF0000',
      },
      boxShadow: {
        'box-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'box-shadow-video': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'user-bg': "url('png-podcast-bg.webp')",
      },
    },
  },
  plugins: [],
}
