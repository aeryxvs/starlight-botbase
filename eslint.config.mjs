import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([{
    languageOptions: {
        globals: {
            ...globals.node,
        },

        ecmaVersion: 2022,
        sourceType: "module",
    },

    rules: {
        "space-infix-ops": "error",

        "space-unary-ops": ["error", {
            words: true,
            nonwords: false,

            overrides: {
                "!": true,
                "!!": true,
            },
        }],

        quotes: ["error", "double"],
        "no-shadow": "error",
    },
}]);