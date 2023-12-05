import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing(utils) {
        const spacings: Record<string, string> = {
          px: "1px",
        };
        for (let i = 2; i < 10; i++) {
          spacings[`${i}px`] = `${i}px`;
        }
        for (let i = 0; i < 10; i += 0.5) {
          spacings[i] = `${i * 0.25}rem`;
        }
        for (let i = 10; i < 512; i++) {
          spacings[i] = `${i * 0.25}rem`;
        }
        return {
          ...spacings,
          ...utils.breakpoints(utils.theme("screens")),
        };
      },
      fontSize: {
        "3xs": ["0.5rem", { lineHeight: "0.5rem" }],
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        md: ["1rem", { lineHeight: "1.5rem" }],
      },
      zIndex() {
        const indices: Record<string, string> = { auto: "auto" };
        for (let i = 0; i < 100; i++) {
          indices[i] = i.toString();
        }
        return indices;
      },
      maxWidth(utils) {
        return {
          ...utils.theme("spacing"),
        };
      },
      minWidth(utils) {
        return {
          ...utils.theme("spacing"),
        };
      },
      maxHeight(utils) {
        return {
          ...utils.theme("spacing"),
        };
      },
      minHeight(utils) {
        return {
          ...utils.theme("spacing"),
        };
      },
    },
  },
  plugins: [],
};
export default config;
