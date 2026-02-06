/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#000000',    // Preto principal
          secondary: '#111111',  // Preto médio
          tertiary: '#1a1a1a',   // Preto claro (hover)
        },
        text: {
          primary: '#ffffff',    // Texto principal
          secondary: '#a3a3a3',  // Texto secundário
          muted: '#6b7280',      // Texto desabilitado
        },
        accent: {
          primary: '#ff9500',    // 🆕 Laranja principal
          hover: '#e68600',      // 🆕 Laranja hover
          light: '#ffa726',      // 🆕 Laranja claro
        },
        success: '#10b981',      // Verde para status positivo
        warning: '#f59e0b',      // Amarelo para avisos
        danger: '#ef4444',       // Vermelho para erros
        sold: '#6b7280',         // Cinza para imóveis vendidos
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      grayscale: {
        '80': '80%',
      },
    },
  },
  plugins: [],
}