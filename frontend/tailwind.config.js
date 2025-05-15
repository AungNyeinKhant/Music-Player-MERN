/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#29383F",
        primaryText: "#ffffff",
        primaryDark: "#1B252A",
        primaryDarkText: "#B3B3B3",
        secondary: "#45C2B1",
        accent: "#808080",
        dashboard: {
          primary: "#1E2A30",
          primaryText: "#FFFFFF",
          primaryDark: "#161F24",
          primaryDarkText: "#A0AAB2",
          secondary: "#995B36",
          accent: "#626262",
        },
      },
    },
  },
  plugins: [],
};
