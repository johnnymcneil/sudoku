import { resolve } from 'path';
import { defineConfig } from 'vite';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'sudoku',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  plugins: [
    react(),
    libInjectCss(),
    dts({ include: 'src', insertTypesEntry: true })
  ]
});
