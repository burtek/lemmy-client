import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        viteTsconfigPaths(),
        react({ babel: { plugins: ['@emotion/babel-plugin'] } })
    ],
    server: { open: true }
});
