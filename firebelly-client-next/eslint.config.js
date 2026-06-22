import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // dist + the vendored, proven data layer copied verbatim from firebelly-client.
  // src/api and src/Redux are intentionally not linted (not our code to restyle).
  globalIgnores(['dist', 'src/api/**', 'src/Redux/**']),

  // Node config files (vite.config.js, eslint.config.js).
  {
    files: ['*.config.js'],
    languageOptions: { globals: globals.node },
  },

  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // shadcn UI modules export a component plus its cva variants — allowed.
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Loading external data (session resume, verify-email, socket) legitimately
      // sets state from an effect; the cascading-render heuristic is too strict here.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
