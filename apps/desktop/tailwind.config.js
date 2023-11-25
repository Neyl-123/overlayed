/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        // iPad Pro vertical is 1024px exactly
        lg: "300px",
        md: "200px",
        sm: "150px",
        xs: "100px",
      },

      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          hovered: "hsl(var(--card-hovered))",
          foreground: "hsl(var(--card-foreground))",
        },
        "error-label": {
          DEFAULT: "hsl(var(--error-label))",
        },

        "difficulty-beginner": "hsl(var(--difficulty-beginner) / <alpha-value>)",
        "difficulty-easy": "hsl(var(--difficulty-easy) / <alpha-value>)",
        "difficulty-medium": "hsl(var(--difficulty-medium) / <alpha-value>)",
        "difficulty-hard": "hsl(var(--difficulty-hard) / <alpha-value>)",
        "difficulty-extreme": "hsl(var(--difficulty-extreme) / <alpha-value>)",
        "difficulty-beginner-dark": "hsl(var(--difficulty-beginner-dark) / <alpha-value>)",
        "difficulty-easy-dark": "hsl(var(--difficulty-easy-dark) / <alpha-value>)",
        "difficulty-medium-dark": "hsl(var(--difficulty-medium-dark) / <alpha-value>)",
        "difficulty-hard-dark": "hsl(var(--difficulty-hard-dark) / <alpha-value>)",
        "difficulty-extreme-dark": "hsl(var(--difficulty-extreme-dark) / <alpha-value>)",
      },
      boxShadow: {
        beginner: "0 0 1rem -0.15rem hsl(var(--difficulty-beginner))",
        easy: "0 0 1rem -0.15rem hsl(var(--difficulty-easy))",
        medium: "0 0 1rem -0.15rem hsl(var(--difficulty-medium))",
        hard: "0 0 1rem -0.15rem hsl(var(--difficulty-hard))",
        extreme: "0 0 1rem -0.15rem hsl(var(--difficulty-extreme))",
        "beginner-dark": "0 0 1rem -0.15rem hsl(var(--difficulty-beginner-dark))",
        "easy-dark": "0 0 1rem -0.15rem hsl(var(--difficulty-easy-dark))",
        "medium-dark": "0 0 1rem -0.15rem hsl(var(--difficulty-medium-dark))",
        "hard-dark": "0 0 1rem -0.15rem hsl(var(--difficulty-hard-dark))",
        "extreme-dark": "0 0 1rem -0.15rem hsl(var(--difficulty-extreme-dark))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
