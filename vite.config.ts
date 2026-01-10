
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';
import process from 'process';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: '/',
    plugins: [react()],
    resolve: {
      alias: [{ find: '@', replacement: fileURLToPath(new URL('./', import.meta.url)) }]
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env': JSON.stringify(env)
    }
  };
});
