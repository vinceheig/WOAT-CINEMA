export default {
  base: '',
  root: 'src',
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    open: true,
    cors: true,
    hmr: {
      overlay: false,
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ['d3'], // Ajoutez d3 ici pour l'optimisation
  },
};