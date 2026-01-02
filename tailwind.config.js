/** 
 * @type {import('tailwindcss').Config}
 * 🎨 玻璃形态设计系统配置 - 基于 UI/UX Pro Max
 */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 字体家族 - Modern Professional
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      
      // 玻璃形态配色
      colors: {
        glass: {
          primary: '#2563EB',
          secondary: '#3B82F6',
          cta: '#F97316',
          bg: '#F8FAFC',
          text: '#1E293B',
          border: '#E2E8F0',
        },
      },
      
      // 动画
      animation: {
        'fadeIn': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slideInLeft': 'slideInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'scaleIn': 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'spin': 'spin 1s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradientShift': 'gradientShift 15s ease infinite',
      },
      
      // 关键帧
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          'from': { opacity: '0', transform: 'translateX(-30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      
      // 背景模糊
      backdropBlur: {
        'glass': '16px',
        'glass-strong': '24px',
      },
      
      // 边框圆角
      borderRadius: {
        'glass': '24px',
        'glass-sm': '16px',
        'glass-lg': '32px',
      },
      
      // 盒子阴影 - 玻璃形态特殊阴影
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)',
        'glass-hover': '0 12px 48px 0 rgba(31, 38, 135, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.4)',
        'glass-strong': '0 16px 64px 0 rgba(31, 38, 135, 0.5), inset 0 2px 2px 0 rgba(255, 255, 255, 0.4)',
        'glass-primary': '0 4px 16px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        'glass-cta': '0 4px 16px rgba(249, 115, 22, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        'glow-primary': '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)',
      },
    },
  },
  plugins: [],
}


