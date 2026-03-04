import { backendEslintConfig } from '@trelinho/config/eslint/backend';

export default backendEslintConfig({
  tsconfigRootDir: import.meta.dirname,
});
