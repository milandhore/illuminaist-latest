/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0F19',
        'card-dark': '#111827',
        'surface-dark': '#1E293B',
        cyan: {
          DEFAULT: '#00F0FF',
          50: '#e0feff',
          100: '#b8fbff',
          200: '#7af5ff',
          300: '#3aeeff',
          400: '#0de4f8',
          500: '#00F0FF',
          600: '#00c4d4',
          700: '#0099a8',
          800: '#097a88',
          900: '#0d6070',
        },
        amber: {
          DEFAULT: '#FFB800',
          50: '#fffce7',
          100: '#fff6c2',
          200: '#ffeb80',
          300: '#ffd833',
          400: '#ffc70a',
          500: '#FFB800',
          600: '#d99200',
          700: '#ae6a02',
          800: '#8f5208',
          900: '#77430b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,240,255,0.15), transparent)',
        'card-glow': 'linear-gradient(135deg, rgba(0,240,255,0.05) 0%, rgba(255,184,0,0.03) 100%)',
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'slide-in-up': 'slideInUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(100%)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        slideInUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0,240,255,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(0,240,255,0.6), 0 0 40px rgba(0,240,255,0.2)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#F1F5F9',
            a: { color: '#00F0FF' },
            h1: { color: '#F1F5F9', fontFamily: 'Outfit, sans-serif' },
            h2: { color: '#F1F5F9', fontFamily: 'Outfit, sans-serif' },
            h3: { color: '#F1F5F9', fontFamily: 'Outfit, sans-serif' },
            h4: { color: '#F1F5F9', fontFamily: 'Outfit, sans-serif' },
            strong: { color: '#F1F5F9' },
            code: { color: '#00F0FF', backgroundColor: '#1E293B', borderRadius: '0.25rem', padding: '0.125rem 0.375rem' },
            blockquote: { borderLeftColor: '#00F0FF', color: '#94A3B8' },
            'ul > li::marker': { color: '#00F0FF' },
            'ol > li::marker': { color: '#00F0FF' },
          },
        },
      },
    },
  },
  plugins: [],
}
