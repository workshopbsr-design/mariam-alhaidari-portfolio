
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

export default defineConfig(({ mode }) => {
  // Use import.meta.url as a type-safe alternative to process.cwd() for determining the current directory
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url))
      }
    },
    define: {
      'process.env': JSON.stringify(env)
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  };
});
