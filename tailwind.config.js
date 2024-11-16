/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // 다크 모드 설정
  theme: {
    extend: {
      colors: {
        dark: "#18171D", // 다크 모드 배경 색상
        nhgreen: "#409e59",
        nhblue: "#0078d4",
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out", // fadeIn 애니메이션 정의
        slideUp: "slideUp 0.4s ease-out", // 추가 애니메이션 예시
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(50px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
