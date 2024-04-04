/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "7AB7FF",
          "secondary": "#a991f7",
          "accent": "#37cdbe",
          "neutral": "#3d4451",
          "base-100": "#FAF9F6",
        },
        dark: {
          "primary": "#0055FD",
          "secondary": "#a991f7",
          "accent": "#37cdbe",
          "neutral": "#3d4451",
          "base-100": "#0C1427",
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}

