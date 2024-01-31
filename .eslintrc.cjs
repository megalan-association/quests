import { env } from "~/env";

/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "@ts-safeql/eslint-plugin"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    // These opinionated rules are enabled in stylistic-type-checked above.
    // Feel free to reconfigure them to your own preference.
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",

    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: { attributes: false },
      },
    ],

    "@ts-safeql/check-sql": [
      "error",
      {
        connections: [
          {
            connectionUrl: env.DATABASE_URL,
            // The migrations path:
            migrationsDir: "./prisma/migrations",
            targets: [
              // This makes `prisma.$queryRaw` and `prisma.$executeRaw` commands linted
              { tag: "db.+($queryRaw|$executeRaw)", transform: "{type}[]" },
            ],
          },
        ],
      },
    ],
  },
};

module.exports = config;
