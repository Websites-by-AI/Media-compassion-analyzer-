import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5000,
      allowedHosts: true,
    },
    build: {
      outDir: 'dist',
      target: 'esnext',
    },
    define: {
      // Polyfill process.env for the existing code that relies on it.
      // This allows 'process.env.API_KEY' to work in the browser after build.
      'process.env': {
        API_KEY: JSON.stringify(env.API_KEY || env.VITE_API_KEY || '')
      }
    }
  };
});