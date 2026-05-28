/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Exact colors from Figma
        sidebar: {
          bg: '#FFFFFF',
          border: '#E5E5E5',
          active: '#F5F5F5',
          hover: '#F5F5F5',
        },
        orange: {
          DEFAULT: '#F97316',
          hover: '#EA6C0A',
          light: '#FFF7ED',
        },
        topbar: {
          bg: '#FFFFFF',
          border: '#E5E5E5',
        },
        card: {
          bg: '#FFFFFF',
          border: '#E5E5E5',
        },
        dark: {
          banner: '#1C1C1E',
        },
        label: '#6B7280',
        ink: '#111827',
        muted: '#6B7280',
        border: '#E5E5E5',
        page: '#F9F9F9',
        badge: {
          easy: { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
          moderate: { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
          hard: { bg: '#FFF1F2', text: '#DC2626', border: '#FECACA' },
        },
        red: { badge: '#EF4444' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '11': ['11px', { lineHeight: '16px' }],
        '12': ['12px', { lineHeight: '16px' }],
        '13': ['13px', { lineHeight: '20px' }],
        '14': ['14px', { lineHeight: '20px' }],
        '15': ['15px', { lineHeight: '22px' }],
        '16': ['16px', { lineHeight: '24px' }],
        '18': ['18px', { lineHeight: '26px' }],
        '20': ['20px', { lineHeight: '28px' }],
        '22': ['22px', { lineHeight: '30px' }],
        '24': ['24px', { lineHeight: '32px' }],
      },
      borderRadius: {
        '4': '4px',
        '6': '6px',
        '8': '8px',
        '10': '10px',
        '12': '12px',
        '16': '16px',
        '20': '20px',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
      },
      boxShadow: {
        card: '0px 1px 3px rgba(0,0,0,0.08), 0px 1px 2px rgba(0,0,0,0.04)',
        dropdown: '0px 4px 16px rgba(0,0,0,0.12)',
        sidebar: '1px 0px 0px #E5E5E5',
      },
      width: {
        sidebar: '216px',
      },
    },
  },
  plugins: [],
};
