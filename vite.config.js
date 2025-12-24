import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx', 'resources/js/Pages/Home.jsx'],
            refresh: true,
        }),
        react(),
    ],

     build: {
        sourcemap: true,       // <-- This is the key
        // minify: false,      // (optional) for even clearer debugging
    },

    server: {
        host: true,
    },
});
