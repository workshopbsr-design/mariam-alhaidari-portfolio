import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  /**
   * Base path
   * ثابت وصريح لتفادي أي التباس مع Vercel أو HashRouter
   */
  base: '/',

  /**
   * React plugin
   */
  plugins: [react()],

  /**
   * Path aliases
   * تجهيز معماري للتطوير المستقبلي
   * (لا يلزم تعديل imports الحالية الآن)
   */
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
