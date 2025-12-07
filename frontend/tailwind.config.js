module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        base: '18px', // au lieu de 16px par défaut
      },
      colors: { // Ajout de la couleur de la marque
        'brand-primary': '#6B1E1E', // Votre couleur actuelle
      },
    },
  },
  plugins: [],
};