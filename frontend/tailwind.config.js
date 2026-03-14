module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cormorant Garamond', 'Times New Roman', 'serif'],
        display: ['Cormorant Garamond', 'Times New Roman', 'serif'],
      },
      colors: {
        'brand': {
          DEFAULT: '#672D0F',
          light: '#4F2009',
          dark: '#3B1607',
          50: '#F5EDE8',
          100: '#E8D0C4',
          200: '#D1A38A',
          500: '#672D0F',
          900: '#2A1106',
        },
        'brand-primary': '#672D0F',
        'gold': {
          DEFAULT: '#C9A961',
          light: '#D4BA7A',
          dark: '#A88B42',
          50: '#FBF7ED',
          100: '#F5EDD4',
          500: '#C9A961',
        },
        'navy': {
          DEFAULT: '#0A0E1A',
          50: '#F0F1F5',
          100: '#D8DAE3',
          700: '#1A2040',
          800: '#0F1529',
          900: '#0A0E1A',
        },
      },
      boxShadow: {
        'premium': '0 4px 30px rgba(0, 0, 0, 0.08)',
        'premium-lg': '0 10px 50px rgba(0, 0, 0, 0.12)',
        'premium-xl': '0 20px 60px rgba(0, 0, 0, 0.15)',
        'gold': '0 4px 30px rgba(201, 169, 97, 0.15)',
        'gold-lg': '0 10px 50px rgba(201, 169, 97, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'hero-overlay': 'linear-gradient(180deg, rgba(10,14,26,0.2) 0%, rgba(10,14,26,0.85) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C9A961, #D4BA7A, #C9A961)',
        'brand-gradient': 'linear-gradient(135deg, #6B1E1E, #8B2E2E)',
        'dark-gradient': 'linear-gradient(180deg, #0A0E1A, #131829)',
      },
    },
  },
  plugins: [],
};