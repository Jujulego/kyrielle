import { swc } from '@jujulego/vite-plugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  cacheDir: '.vite',
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    reporters: ['default', 'junit'],
    coverage: {
      include: ['src/**'],
      reporter: ['text', 'lcovonly'],
    },
    outputFile: {
      junit: 'junit-report.xml'
    },
    typecheck: {
      tsconfig: 'tests/tsconfig.json',
    }
  },
  plugins: [
    swc()
  ]
});
