import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
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
      // Buscar dados no mount (efeito que dispara setState) é um padrão
      // aceito neste projeto.
      'react-hooks/set-state-in-effect': 'off',
      // Contextos exportam o Provider + o hook (ex.: useAuth) no mesmo
      // arquivo — padrão comum; rebaixado de erro para aviso.
      'react-refresh/only-export-components': 'warn',
    },
  },
])
