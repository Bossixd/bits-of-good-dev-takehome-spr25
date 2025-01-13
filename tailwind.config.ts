import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#0070ff",
                    fill: "#eff6ff",
                },
                gray: {
                    fill: {
                        DEFAULT: "#f2f2f2",
                        light: "#fcfcfd",
                    },
                    stroke: "#eaecf0",
                    text: {
                        DEFAULT: "#667084",
                        dark: "#6a6a6a",
                    },
                },
                success: {
                    fill: "#ecfdf3",
                    indicator: "#14ba6d",
                    text: "#037847",
                },
                danger: {
                    fill: "#ffd2d2",
                    indicator: "#d40400",
                    text: "#8d0402",
                },
                warning: {
                    fill: "#ffebc8",
                    indicator: "#ffbe4c",
                    text: "#7b5f2e",
                },
                negative: {
                    fill: "#ffdac3",
                    indicator: "#fd8033",
                    text: "#a43e00",
                },
            },
            fontFamily: {
                DEFAULT: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
} satisfies Config;
