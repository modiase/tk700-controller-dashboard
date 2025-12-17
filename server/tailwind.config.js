/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{svelte,js,ts}'],
  prefix: 'tw-',
  important: true,
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFD6E8',
          blue: '#C7DEFF',
          purple: '#E0D4FF',
          green: '#D4FFEA',
          yellow: '#FFF9D4',
          peach: '#FFE4D4',
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
