import globals from "globals";
import tseslint from "typescript-eslint";


export default [
  {settings:{
    react: {
      version: 'detect',
    }
  }},
  {extends:
    ['plugin:react/jsx-runtime'],
  },
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
];