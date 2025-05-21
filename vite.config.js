export default {
  root: 'src',
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    open: true,
    cors: true,
    hmr: {
      overlay: false
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
}