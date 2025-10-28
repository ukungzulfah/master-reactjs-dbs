import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true, // atau host: '0.0.0.0'
//     port: 5173, // port default Vite
//   },
// });

export default defineConfig({
  server: {
    host: true, // atau host: '0.0.0.0'
    port: 5173, // port default Vite
  },
  plugins: [
    // aktifkan saat publish
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/**/*',
          dest: 'assets' // ini untuk /assets/
        },
        {
          src: 'src/assets/**/*',
          dest: 'src/assets' // ini untuk /src/assets/ fallback
        }
      ]
    }),
    
    react({
      babel: {
        plugins: [
          ["@babel/plugin-proposal-decorators", { "legacy": true }],
          ["@babel/plugin-proposal-class-properties", { "loose": true }]
        ]
      }
    }),
  ],
})