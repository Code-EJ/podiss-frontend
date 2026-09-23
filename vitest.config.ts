import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Credits: oEnzoRibas. Tests never inherit the user's private API endpoint.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    env: { VITE_API_URL: 'http://localhost:18080' },
    restoreMocks: true,
  },
});
